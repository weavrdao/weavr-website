import * as CommonUtils from "../../utils/common"
import StorageNetwork from "../../data/network/storage/storageNetwork"
import { Proposal } from "../../models/proposal"
import { VoteType } from "../../models/vote"
import { GraphQLAPIClient, ALL_ASSETS_QUERY, PARTICIPANTS_PER_DAO, ALL_PROPOSALS } from "../../data/network/graph/graphQLAPIClient"
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient"
import AssetContract from "../../data/network/web3/contracts/assetContract"
import { ethers } from "ethers"
import { getBytes32FromIpfsHash } from "../../data/network/storage/ipfs/common";
// TODO: Should there be a single service instance per proposal?

/**
 * DAO service
 * @param {EthereumClient} ethereumClient Ethereum client
 * @param {GraphQLAPIClient} graphQLAPIClient GraphQL API Client
 * @param {StorageNetwork} storageNetwork Storage network to use
 */
class DAO {
  constructor(
    ethereumClient,
    graphQLAPIClient,
    storageNetwork,
  ) {
    this.ethereumClient = ethereumClient
    this.graphQLAPIClient = graphQLAPIClient
    this.storageNetwork = storageNetwork
  }

  /** 
   * Get proposals that from this asset"s DAO.
   * @param {string} proposalId
   */
  // eslint-disable-next-line max-lines-per-function
  async getProposalsForAsset(
    assetId
  ) {
    // Get indexed on-chain data

    let proposals = await this.graphQLAPIClient
      .query(
        ALL_PROPOSALS,
        { id: assetId },
        (mapper, response) => { return mapper.mapProposals(response.data.frabric) }
      )

    // Fetch and append off-chain data
    try {
      const offChainData = (await this.storageNetwork.getFiles(proposals.map(p => p.info)));
      console.log(offChainData);

      for (let i = 0; i < proposals.length; i++) {
        console.log(offChainData[i]);
        if (offChainData[i].value) {
          proposals[i].title = offChainData[i].value.title || "Untitled";
          proposals[i].description = offChainData[i].value.description || "No description";
        } else {
          proposals[i].title = "Untitled";
          proposals[i].description = "No description";
        }

      }
    } catch (e) {
      console.log(e);
    }

    // This block is for testing purposes only and should be removed
    // } finally {
    //   const offChainData = (new Array(proposals.length)).fill({
    //     title: "Test title",
    //     description: "Test description",
    //   }, 0, proposals.length);
    //   for (let i = 0; i < proposals.length; i++) {
    //     proposals[i].title = offChainData[i].title;
    //     proposals[i].description = offChainData[i].description;
    //   }
    // }
    return proposals;
  }


  /**
   * Create a proposal
   * @param {String} asset Asset's contract address
   * @param {string} title Proposal title
   * @param {string} description Proposal body
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async createPaperProposal(
    asset,
    title,
    description
  ) {
    const assetContract = new AssetContract(this.ethereumClient, asset);

    const infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title,
      description,
    });
    if (!infoHash) return;

    const status = await assetContract.proposePaper(false, infoHash);
    return status
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
    description,
  ) {
    console.log("###### ASSET: ", assetId);
    const assetContract = new AssetContract(this.ethereumClient, assetId)
    console.log("DAO-service:\t", participantType, ", ", description)
    let infoHash = await this.storageNetwork
      .uploadAndGetPathAsBytes({
        title: `Proposing ${participant} for level ${participantType}`,
        description
      });

    if (!infoHash) return;

    let status = await assetContract.proposeParticipant(3, participant, infoHash)
    return status
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
    version,
  ) {
    // Hardcoding these for simplicity
    const ASSET_ADDRESS = assetAddress || "0xa7930bfc863b895de85307457b976b12515389fb";
    const THREAD_DEPLOYER_ADDRESS = "0xf033246E5301FD64de5C2bE408262eCeFd2A3aC4";
    const BOND_ADDRESS = "0x4e8DEF7A306C50c99c8f434bFA0D98aE6B790878";
    const DATA = ethers.utils.defaultAbiCoder.encode(
      ["address", "address"],
      [BOND_ADDRESS, THREAD_DEPLOYER_ADDRESS],
    );

    const assetContract = new AssetContract(this.ethereumClient, ASSET_ADDRESS);

    console.dir(assetContract);

    const ipfsPathBytes = await this.storageNetwork
      .uploadAndGetPathAsBytes(
        {
          title: title,
          description: description
        }
      );

    console.log({
      beaconAddress,
      instanceAddress,
      version,
      codeAddress,
      DATA,
      ipfsPathBytes,
    })

    const status = await assetContract.proposeUpgrade(
      beaconAddress,
      instanceAddress,
      version,
      codeAddress,
      DATA,
      ipfsPathBytes,
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
    description,
  ) {
    const assetContract = new AssetContract(this.ethereumClient, targetAddress);

    const ipfsPathBytes = await this.storageNetwork
      .uploadAndGetPathAsBytes({ title, description });

    const status = await assetContract.proposeTokenAction(
      tokenAddress,
      targetAddress,
      mint,
      price,
      amount,
      ipfsPathBytes,
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
    ]

    console.log("asset from DAO: ", asset);
    const assetContract = new AssetContract(this.ethereumClient, asset);

    let signArgs = JSON.parse(JSON.stringify(signCfg))
    signArgs[1] = { Vouch: signArgs[1].Vouch }
    console.log("SIGNARGS: ", signArgs, participant);
    let signature = (await this.ethereumClient
      .getSignature(signArgs, participant))
    console.log("after signature");
    console.log("Signature", signature);
    signature = ethers.utils.defaultAbiCoder.encode(signature)
    console.log("Encoded Signature: ", signature);
    const tx_result = await assetContract.vouch(participant, signature)
  }
  /**
   * Vote on a proposal
   * @param {Asset} asset Asset that the DAO controls
   * @param {Proposal} proposal Proposal to vote on
   * @param {VoteType} voteType Type of the vote
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async vote(
    asset,
    proposal,
    voteType
  ) {
    const assetContract = new AssetContract(this.ethereumClient, asset.contractAddress)

    let status

    switch (voteType) {
      case VoteType.Yes:
        status = await assetContract.voteYes(proposal.id)
        break
      case VoteType.No:
        status = await assetContract.voteNo(proposal.id)
        break
      case VoteType.Abstain:
        // Not supported at the moment
        break
      default: VoteType.Abstain
        break
    }

    return status
  }
}

export default DAO
