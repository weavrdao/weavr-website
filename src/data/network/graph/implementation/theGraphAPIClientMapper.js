/* eslint-disable class-methods-use-this */
/* eslint-disable max-lines-per-function */

import GraphQLAPIMapper from "../graphQLAPIMapper"
import {
  mapPaperProposals,
  mapUpgradeProposals,
  mapParticipantProposals,
  mapTokenActionProposals,
  mapThreadProposals,
  mapVouchers,
  mapWeavrWhitelist
} from "./proposals";

class TheGraphAPIMapper extends GraphQLAPIMapper {

  // TODO(bill): This was invalid with the data model and needs to be rewritten
  mapAssets(rawAssets) {
    console.log(rawAssets)
  }

  mapVouchers(rawVouchers) {
    console.log(rawVouchers);
    if (!rawVouchers || !rawVouchers.length < 1) return [];

    return  rawVouchers.length
  }

  mapWeavrWhitelist(rawWeavrWhitelistRecords) {
    console.log(rawWeavrWhitelistRecords.frabric.participants)
    const participants = rawWeavrWhitelistRecords.frabric.participants.map( record => {
      console.log("1\n",record.address);
      return record.address
    })
    const whitelisted = rawWeavrWhitelistRecords.frabric.token.whitelist.map( record => {
      console.log("2\n",record.person)
      return record.person
    })
    
    return [... new Set(participants.concat( whitelisted))]
  }

  mapTokenInfo(rawWeavrTokenInfo) {
    console.log("MAPPER___", rawWeavrTokenInfo)
    return rawWeavrTokenInfo.frabric.token
  }

  // Map all proposal types to a single array to be written to global state
  mapProposals(rawProposals) {
    console.log("RAW", rawProposals)
    if (!rawProposals || rawProposals.length < 1) return [];

    return [
      ...mapPaperProposals(rawProposals.paperProposals),
      ...mapUpgradeProposals(rawProposals.upgradeProposals),
      ...mapParticipantProposals(rawProposals.participantProposals),
      ...mapTokenActionProposals(rawProposals.tokenActionProposals),
      ...mapThreadProposals(rawProposals.threadProposal),
    ];
  }
}

export default TheGraphAPIMapper;
