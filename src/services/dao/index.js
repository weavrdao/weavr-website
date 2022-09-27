import * as CommonUtils from "../../utils/common"
import StorageNetwork from "../../data/network/storage/storageNetwork"
import { Proposal } from "../../models/proposal"
import { VoteType } from "../../models/vote"
import { GraphQLAPIClient, ALL_ASSETS_QUERY, PARTICIPANTS_PER_DAO, ALL_PROPOSALS, VOUCHES_PER_PARTICIPANT } from "../../data/network/graph/graphQLAPIClient"
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient"
import { CONTRACTS } from "../constants"
import AssetContract from "../../data/network/web3/contracts/assetContract"
import { ethers } from "ethers"
import { getBytes32FromIpfsHash } from "../../data/network/storage/ipfs/common";
import { ProposalTypes } from "../../models/common"
import { createToaster } from "@meforma/vue-toaster"
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
    const toast = createToaster({})
    toast.info("Fetching off-chain data...")
    let proposals = await this.graphQLAPIClient
      .query(
        ALL_PROPOSALS,
        { id: assetId },
        (mapper, response) => { return mapper.mapProposals(response.data.frabric) }
      )

    // Fetch and append off-chain data
    try {
      const offChainData = (await this.storageNetwork.getFiles(proposals.map(p => p.info)));

      for (let i = 0; i < proposals.length; i++) {
        if (offChainData[i].value) {
          proposals[i].title = offChainData[i].value.title || "Untitled";
          proposals[i].description = offChainData[i].value.description || "No description";
          proposals[i].daoResolution = offChainData[i].value.daoResolution || false
        } else {
          proposals[i].title = "Untitled";
          proposals[i].description = "No description";
          proposals[i].daoResolution = false
        }
      }
      toast.clear()
    } catch (e) {
      console.log(e);
    }

    try {
      const descriptorData = (await this.storageNetwork.getFiles(proposals.map(proposal => proposal.descriptor)));
      for (let i = 0; i < proposals.length; i++) {
        if (descriptorData[i] && descriptorData[i].value) {
          proposals[i].title = descriptorData[i].value.descriptor || "Untitled";
        } else {
          proposals[i].descriptor = "No descriptor";
        }
      }
    } catch (e) {
      console.log(e);
    }

    return proposals;
  }

  async getUserVouches (signer) {
    console.log("vouches")
    let vouches = await this.graphQLAPIClient
    .query(
      VOUCHES_PER_PARTICIPANT,
      { id: process.env.INITIALFRABRIC, signer: signer },
      (mapper, response) => { return mapper.mapVouchers(response.data) }
    )

    console.log(vouches)
    return vouches
  }
  async createThreadProposal(
    assetId,
    name,
    descriptor,
    title,
    description,
    symbol,
    tradeToken,
    target,
  ) {
    const assetContract = new AssetContract(this.ethereumClient, assetId);

    const infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title,
      description,
    });

    const descriptorHash = await this.storageNetwork.uploadAndGetPathAsBytes(descriptor);

    console.dir({
      assetId,
      name,
      descriptor,
      title,
      description,
      symbol,
      tradeToken,
      target,
    })
    const data = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint112"],
      [tradeToken, target],
    );

    if (!infoHash) return;

    const status = await assetContract.proposeThread(
      0, // Only valid "variant" number
      name,
      symbol,
      descriptorHash,
      data,
      infoHash,
      {
        gasLimit: 300000
      }
    );
    return status
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
    description,
    daoResolution
  ) {
    const assetContract = new AssetContract(this.ethereumClient, asset);

    const infoHash = await this.storageNetwork.uploadAndGetPathAsBytes({
      title,
      description,
      daoResolution
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
    const assetContract = new AssetContract(this.ethereumClient, assetId)
    let infoHash = await this.storageNetwork
      .uploadAndGetPathAsBytes({
        title: `Proposing ${participant} for level ${participantType}`,
        description
      });

    if (!infoHash) return;
    
    let status = await assetContract.proposeParticipant(participantType, participant, infoHash)
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
    signer,
    governor
  ) {
    if(
      !assetAddress ||
      !beaconAddress ||
      !instanceAddress ||
      !codeAddress ||
      !version ||
      !signer ||
      !governor
    ){
      console.log("Something wrong with the parameters at DAOservice level");

      return {assetAddress,
        beaconAddress,
        instanceAddress,
        codeAddress,
        title,
        description,
        version,
        signer,
        governor}
    }else {
      const DATA = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "address", "address"],
        [CONTRACTS.BOND, CONTRACTS.THREAD_DEPLOYER, signer, governor],
      );
      const payload = {
        assetAddress: assetAddress,
        beaconAddress: beaconAddress,
        instanceAddress: instanceAddress,
        version: version,
        codeAddress: codeAddress
      }
      console.log(payload);
      const assetContract = new AssetContract(this.ethereumClient, assetAddress);

      const ipfsPathBytes = await this.storageNetwork
        .uploadAndGetPathAsBytes(
          {
            title: title,
            description: description
          }
        );

      const status = await assetContract.proposeUpgrade(
        beaconAddress,
        instanceAddress,
        version,
        codeAddress,
        DATA,
        ipfsPathBytes
      ).then( x => {
        console.log("RETURN", x);
      }).catch(err => {
        console.log("ERR: => ", err.message);
      });

      return status;
    }
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

  async vouch(participant, data) {
    const assetContract = new AssetContract(this.ethereumClient, CONTRACTS.WEAVR);

    const status = await assetContract.vouch(participant, data);
    
    return status;
  }
  /**
   * Vote on a proposal
   * @param {Asset} asset Asset that the DAO controls
   * @param {Proposal} proposal Proposal to vote on
   * @param {VoteType} voteType Type of the vote
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async vote(
    assetAddress,
    proposalId,
    votes,
  ) {
    const assetContract = new AssetContract(this.ethereumClient, assetAddress)
    const status = await assetContract.vote(proposalId, votes);
    return status;
  }
}

export default DAO
