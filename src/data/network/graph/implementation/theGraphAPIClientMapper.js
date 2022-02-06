import GraphQLAPIMapper from "../graphQLAPIMapper"
import Asset  from "../../../../models/asset"
import Proposal  from "../../../../models/proposal"
import { Vote }  from "../../../../models/vote"
import { MarketOrder } from "../../../../models/marketOrder"

class TheGraphAPIMapper extends GraphQLAPIMapper {
  mapAssets(rawAssets) {
    if (!rawAssets || rawAssets.length < 1) {
      return []
    }

    return rawAssets
      .map(rawAsset => {
        const proposals = this.mapProposals(rawAsset.proposals)

        var ownersMap = new Map()
        rawAsset.owners
          .forEach(ownership => { 
            ownersMap.set(ownership.owner, ownership.shares)
          })

        let marketOrders = this.mapMarketOrders(rawAsset.marketOrders)

        return new Asset(
          rawAsset.id,
          rawAsset.mintedAsset.dataURI,
          rawAsset.contract,
          rawAsset.symbol,
          rawAsset.numOfShares,
          ownersMap,
          marketOrders,
          proposals
        )
      })
  }

  mapMarketOrders(rawMarketOrders) {
    if (!rawMarketOrders || rawMarketOrders.length < 1) {
      return []
    }

    return rawMarketOrders
      .map(rawMarketOrder => {
        return new MarketOrder(
          rawMarketOrder.id,
          rawMarketOrder.orderType,
          rawMarketOrder.price,
          rawMarketOrder.amount
        )
      })
  }

  mapProposals(rawProposals) {
    if (!rawProposals || rawProposals.length < 1) {
      return []
    }

    return rawProposals
      .map(rawProposal => {
        const votes = this.mapVotes(rawProposal.votes)

        return new Proposal(
          rawProposal.id,
          rawProposal.creator,
          rawProposal.dataURI,
          rawProposal.startTimestamp,
          rawProposal.endTimestamp,
          votes
        )
      })
  }

  mapVotes(rawVotes) {
    if (!rawVotes || rawVotes.length < 1) {
      return []
    }

    return rawVotes
      .map(rawVote => {
        return new Vote(
          rawVote.id,
          rawVote.voter,
          rawVote.voteType,
          rawVote.count
        )
      })
  }
}

export default TheGraphAPIMapper