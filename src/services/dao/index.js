import * as CommonUtils from "../../utils/common";
import StorageNetwork from "../../data/network/storage/storageNetwork";
import { Proposal } from "../../models/proposal";
import { VoteType } from "../../models/vote";
import {
  GraphQLAPIClient,
  ALL_ASSETS_QUERY,
  PARTICIPANTS_PER_DAO,
  ALL_PROPOSALS,
} from "../../data/network/graph/graphQLAPIClient";
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient";
import { THREAD_DEPLOYER_ADDRESS, BOND_ADDRESS } from "../constants";
import AssetContract from "../../data/network/web3/contracts/assetContract";
import { ethers } from "ethers";
import { getBytes32FromIpfsHash } from "../../data/network/storage/ipfs/common";
import FrabricERC20Contract from "../../data/network/web3/contracts/frabricERC20Contract";
// TODO: Should there be a single service instance per proposal?

/**
 * DAO service
 * @param {EthereumClient} ethereumClient Ethereum client
 * @param {GraphQLAPIClient} graphQLAPIClient GraphQL API Client
 * @param {StorageNetwork} storageNetwork Storage network to use
 */
class DAO {
  constructor(ethereumClient, graphQLAPIClient, storageNetwork) {
    this.ethereumClient = ethereumClient;
    this.graphQLAPIClient = graphQLAPIClient;
    this.storageNetwork = storageNetwork;
  }

  /**
   * Get proposals that from this asset"s DAO.
   * @param {string} proposalId
   */
  // eslint-disable-next-line max-lines-per-function
  async getProposalsForAsset(assetId) {
    // Get indexed on-chain data
    let proposals = await this.graphQLAPIClient.query(
      ALL_PROPOSALS,
      { id: assetId },
      (mapper, response) => {
        return mapper.mapProposals(response.data.frabric);
      }
    );

    // Fetch and append off-chain data
    try {
      const offChainData = await this.storageNetwork.getFiles(
        proposals.map((p) => p.info)
      );

      for (let i = 0; i < proposals.length; i++) {
        if (offChainData[i].value) {
          proposals[i].title = offChainData[i].value.title || "Untitled";
          proposals[i].description =
            offChainData[i].value.description || "No description";
        } else {
          proposals[i].title = "Untitled";
          proposals[i].description = "No description";
        }
      }
    } catch (e) {
      console.log(e);
    }

    return proposals;
  }

  /**
   * Create a proposal
   * @param {String} asset Asset's contract address
   * @param {string} title Proposal title
   * @param {string} description Proposal body
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async createPaperProposal(asset, title, description) {
    const assetContract = new AssetContract(this.ethereumClient, asset);

    const infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title,
      description,
    });
    if (!infoHash) return;

    const status = await assetContract.proposePaper(false, infoHash);
    return status;
  }

  /**
   * Create a proposal
   * @param {String} asset Asset's contract address
   * @param {number} participantType Proposal title
   * @param {string} description Proposal body
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async createParticipantProposal(
    assetId,
    participantType,
    participant,
    description
  ) {
    const assetContract = new AssetContract(this.ethereumClient, assetId);
    let infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title: `Proposing ${participant} for level ${participantType}`,
      description,
    });

    if (!infoHash) return;

    let status = await assetContract.proposeParticipant(
      3,
      participant,
      infoHash
    );
    return status;
  }

  /**
   * Create an upgrade proposal
   * @param {String} assetAddress Asset's contract address
   * @param {String} beaconAddress Address of beacon handling upgrade
   * @param {Number} version Version number (simple increment)
   * @param {String} codeAddress Address of new contract
   * @param {String} upgradeData Data to be passed to newly upgraded contract
   * @param {String} title Proposal title
   * @param {String} description Proposal description
   * @returns {String} version Transaction status (true — mined; false - reverted)
   */
  // eslint-disable-next-line max-lines-per-function
  async createUpgradeProposal(
    assetAddress,
    beaconAddress,
    instanceAddress,
    codeAddress,
    title,
    description,
    version
  ) {
    // Hardcoding these for simplicity
    const ASSET_ADDRESS =
      assetAddress || "0xa7930bfc863b895de85307457b976b12515389fb";
    const DATA = ethers.utils.defaultAbiCoder.encode(
      ["address", "address"],
      [BOND_ADDRESS, THREAD_DEPLOYER_ADDRESS]
    );

    const assetContract = new AssetContract(this.ethereumClient, ASSET_ADDRESS);

    const ipfsPathBytes = await this.storageNetwork.uploadAndGetPathAsBytes({
      title: title,
      description: description,
    });

    const status = await assetContract.proposeUpgrade(
      beaconAddress,
      instanceAddress,
      version,
      codeAddress,
      DATA,
      ipfsPathBytes
    );

    return status;
  }

  async createTokenActionProposal(
    tokenAddress,
    targetAddress,
    mint,
    price,
    amount,
    title,
    description
  ) {
    const assetContract = new AssetContract(this.ethereumClient, targetAddress);

    const ipfsPathBytes = await this.storageNetwork.uploadAndGetPathAsBytes({
      title,
      description,
    });

    const status = await assetContract.proposeTokenAction(
      tokenAddress,
      targetAddress,
      mint,
      price,
      amount,
      ipfsPathBytes
    );

    return status;
  }

  async vouch(asset, domain, participant) {
    const signCfg = [
      {
        name: "Frabric Protocol",
        version: "1",
        chainId: 4,
      },
      {
        Vouch: [{ type: "address", name: "participant" }],
        KYCVerification: [
          { type: "uint8", name: "participantType" },
          { type: "address", name: "participant" },
          { type: "bytes32", name: "kyc" },
          { type: "uint256", name: "nonce" },
        ],
      },
    ];
    const assetContract = new AssetContract(this.ethereumClient, asset);

    let signArgs = JSON.parse(JSON.stringify(signCfg));
    signArgs[1] = { Vouch: signArgs[1].Vouch };
    console.log("SIGNARGS: ", signArgs, participant);
    let signature = await this.ethereumClient.getSignature(
      signArgs,
      participant
    );
    signature = ethers.utils.defaultAbiCoder.encode(signature);
    const tx_result = await assetContract.vouch(participant, signature);
  }
  /**
   * Vote on a proposal
   * @param {Asset} asset Asset that the DAO controls
   * @param {Proposal} proposal Proposal to vote on
   * @param {VoteType} voteType Type of the vote
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async vote(assetAddress, proposalId, votes) {
    const assetContract = new AssetContract(this.ethereumClient, assetAddress);
    const status = await assetContract.vote(proposalId, votes);
    return status;
  }

  async getTokenAddress(frabricAddress) {
    const assetContract = new AssetContract(
      this.ethereumClient,
      frabricAddress
    );

    const erc20Address = await assetContract.erc20();

    return erc20Address;
  }

  async getTokenDecimals(frabricAddress) {
    const erc20Address = this.getTokenAddress(frabricAddress);
    console.log(erc20Address);
    const tokenContract = new FrabricERC20Contract(this.ethereumClient, erc20Address);

    const decimals = await tokenContract.decimals();
    return decimals;
  }
}

export default DAO;
