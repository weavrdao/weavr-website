import * as CommonUtils from "../../utils/common"
import StorageNetwork from "../../data/network/storage/storageNetwork"
import Proposal from "../../models/proposal"
import { VoteType } from "../../models/vote"
import { GraphQLAPIClient, ALL_ASSET_PROPOSALS_QUERY } from "../../data/network/graph/graphQLAPIClient"
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient"
import AssetContract from "../../data/network/web3/contracts/assetContract"

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
        ALL_ASSET_PROPOSALS_QUERY,
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
   * @param {Asset} asset Asset that the DAO controls
   * @param {string} title Proposal title
   * @param {string} description Proposal body
   * @returns {Boolean} Transaction status (true — mined; false - reverted)
   */
  async createProposal(
    asset,
    title,
    description
  ) {
    const assetContract = new AssetContract(this.ethereumClient, asset.contractAddress)

    let proposalCID = await this.storageNetwork
      .addFile(
        {
          title: title,
          description: description
        }
      )

    if (proposalCID == null) {
      return
    }

    let proposalURI = "ipfs://" + proposalCID.path

    let status = await assetContract.proposePaper(proposalURI)

    return status
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
