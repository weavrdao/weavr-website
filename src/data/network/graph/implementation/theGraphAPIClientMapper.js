/* eslint-disable class-methods-use-this */
/* eslint-disable max-lines-per-function */

import GraphQLAPIMapper from "../graphQLAPIMapper"
import Thread from "@/models/marketplace/thread"
import Needle from "@/models/marketplace/needle"
import Erc20 from "@/models/erc20"
import { Vote } from "../../../../models/vote"
import { MarketOrder } from "../../../../models/marketplace/marketOrder"
import {
  mapPaperProposals,
  mapUpgradeProposals,
  mapParticipantProposals,
  mapTokenActionProposals,
  mapThreadProposals, mapParticipantRemovalProposals,
} from "./proposals";

class TheGraphAPIMapper extends GraphQLAPIMapper {

  // TODO(bill): This was invalid with the data model and needs to be rewritten
  mapAssets(rawAssets) {
    console.log(rawAssets)
  }

  mapVouchers(rawVouchers) {
    console.log(rawVouchers);
    if (!rawVouchers || !rawVouchers.length < 1) return [];

    return rawVouchers.length
  }

  mapWeavrWhitelist(rawWeavrWhitelistRecords) {
    console.log(rawWeavrWhitelistRecords.frabric.participants)
    const participants = rawWeavrWhitelistRecords.frabric.participants.map(record => {
      console.log("1\n", record.address);
      return record.address
    })
    const whitelisted = rawWeavrWhitelistRecords.frabric.token.whitelist.map(record => {
      console.log("2\n", record.person)
      return record.person
    })

    return [...new Set(participants.concat(whitelisted))]
  }

  mapTokenInfo(rawWeavrTokenInfo) {
    console.log("MAPPER___", rawWeavrTokenInfo)
    return rawWeavrTokenInfo.frabric.token
  }

  mapRawThreads(rawThreads) {
    console.log("RAW THREAD", rawThreads)
    if (!rawThreads || rawThreads.length < 1) {
      return []
    }
    return rawThreads
      .map(rawThread => {
        const erc20 = new Erc20(
          rawThread.thread.erc20.id,
          rawThread.thread.erc20.name,
          rawThread.thread.erc20.symbol,
          rawThread.thread.erc20.decimals,
          rawThread.thread.erc20.supply,
          rawThread.thread.erc20.tradeToken,
          rawThread.thread.erc20.balances
        )
        return new Thread(
          rawThread.thread.id,
          rawThread.thread.variant,
          rawThread.thread.governor,
          erc20,
          rawThread.thread.descriptor
        )
      })
  }

  mapRawNeedles(rawNeedles) {
    if (!rawNeedles || rawNeedles.length < 1) {
      return []
    }
  
    return rawNeedles
      .map(
        rawNeedle => new Needle(
          rawNeedle.id,
          rawNeedle.state,
          rawNeedle.amountDeposited,
          rawNeedle.target,
          rawNeedle.thread,
          rawNeedle.deposits,
        )
      )
  }

  mapRawMarketOrders(rawOrders) {
    if (!rawOrders || rawOrders.data) return [];

    const orders = rawOrders.frabrics[0].threads; // TODO(bill): Add full path here

    // Questionable way of getting test data but will do for now
    return this.mapMarketOrders(orders)
  }

  mapMarketOrders(rawMarketOrders) {
    if (!rawMarketOrders || rawMarketOrders.length < 1) {
      return []
    }

    return rawMarketOrders
      .map(rawMarketOrder => {
        return new MarketOrder(
          rawMarketOrder.id,
          rawMarketOrder.type,
          rawMarketOrder.price,
          rawMarketOrder.totalAmount
        )
      })
  }

  
  mapRawErc20(rawErc20) {
    if (!rawErc20 || rawErc20.length < 1) {
      return []
    }
    console.log("ERC20\n", rawErc20) 
    return new Erc20(
      rawErc20.name,
      rawErc20.symbol,
      rawErc20.decimals,
      rawErc20.supply,
      rawErc20.tradeToken
    )
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
      }
      )
  }

  // Map all proposal types to a single array to be written to global state
  mapProposals(rawProposals) {
    console.log("RAW", rawProposals)
    if (!rawProposals || rawProposals.length < 1) return [];

    return [
      ...mapPaperProposals(rawProposals.paperProposals),
      ...mapUpgradeProposals(rawProposals.upgradeProposals),
      ...mapParticipantProposals(rawProposals.participantProposals),
      ...mapParticipantRemovalProposals(rawProposals.participantRemovalProposals),
      ...mapTokenActionProposals(rawProposals.tokenActionProposals),
      ...mapThreadProposals(rawProposals.threadProposals),
    ];
  }
}

export default TheGraphAPIMapper;
