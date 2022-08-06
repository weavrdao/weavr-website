import * as CommonUtils from "../../utils/common"
import StorageNetwork from "../../data/network/storage/storageNetwork"
import {Proposal} from "../../models/proposal"
import { VoteType } from "../../models/vote"
import { GraphQLAPIClient, ALL_ASSETS_QUERY, PARTICIPANTS_PER_DAO } from "../../data/network/graph/graphQLAPIClient"
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient"
import AssetContract from "../../data/network/web3/contracts/assetContract"
import { ethers } from "ethers"
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
  async getProposalsForAsset(
    assetId
  ) {
    // Get indexed on-chain data

    var proposals = await this.graphQLAPIClient
      .query(
        PARTICIPANTS_PER_DAO,
        { assetId },
        (mapper, response) => { return mapper.mapProposals(response.data.proposals) }
      )

    console.log("Mapped proposals:")
    console.log(proposals)

    // Fetch and append off-chain data

    const proposalDataURIArray = proposals
      .map(proposal => proposal.dataURI)
    let proposalOffchainDataArray = (
      await this.storageNetwork
        .getFiles(proposalDataURIArray.map(uri => CommonUtils.pathFromURL(uri)))
    )

    console.log("Off-chain data:", proposalOffchainDataArray);

    if (proposalOffchainDataArray.length != proposals.length) {
      throw ("Off-chain data count doesn't match the on-chain data")
    }

    for (var i = 0; i < proposals.length; i++) {
      let proposal = proposals[i]
      let data = proposalOffchainDataArray[i]

      let completeProposal = new Proposal(
        proposal.id,
        proposal.creatorAddress,
        proposal.dataURI,
        proposal.startTimestamp,
        proposal.endTimestamp,
        proposal.votes,
        data.title,
        data.description
      )

      proposals[i] = completeProposal
    }

    return proposals
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
    const assetContract = new AssetContract(this.ethereumClient, asset)
    console.log("DAO-service: ", asset, ", ", title, ", ", description)
    let proposalCID = await this.storageNetwork
      .addFile(
        {
          title: title,
          description: description
        }
      )
    console.log("here or not");
    if (proposalCID == null) {
      console.log("CID not created");
      return
    }
    let proposalURI = ethers.utils.id(proposalCID) 
    
    let status = await assetContract.proposePaper(false, proposalURI)

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
    let proposalCID = await this.storageNetwork
      .addFile(
        {
          description: "This participant has been proposed as KYC"
        }
      )

    if (proposalCID == null) {
      return
    }
    const hashedCID = this.storageNetwork.getBytes32FromIpfsHash(proposalCID.path)
    // console.log((await this.storageNetwork.getFile(proposalCID)))
    console.log(proposalCID.path);
    let status = await assetContract.proposeParticipant(3, participant, hashedCID)

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
    // beaconAddress,
    codeAddress,
    // upgradeData,
    title,
    description,
    version = 2, // Required for validateUpgrade to run correctly
  ) {
    // Hardcoding these for simplicity
    const ASSET_ADDRESS = assetAddress || "0x8C1a3931102f4D65c91f2DDA5166f8970f2760A8";
    const BEACON_ADDRESS = "0xc4cad6434a405a3d9c89cbcb0d1a77b6eceb4bf7";
    const THREAD_DEPLOYER_ADDRESS = "0xF78C9BCA95f98Eb8EB241Af0865946429a8A5050";
    const BOND_ADDRESS = "0x20cf3b3A2dA25B726eE367e20F5659f1794994a2";
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
      BEACON_ADDRESS,
      assetAddress,
      version,
      codeAddress,
      DATA,
      ipfsPathBytes,
    })

    const createUpgradeProposalTx = await assetContract.proposeUpgrade(
      BEACON_ADDRESS,
      ASSET_ADDRESS,
      version,
      codeAddress,
      DATA,
      ipfsPathBytes,
    );

    const txReciept = await createUpgradeProposalTx.wait();
    return txReciept.status;
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
    }

    return status
  }
}

export default DAO
