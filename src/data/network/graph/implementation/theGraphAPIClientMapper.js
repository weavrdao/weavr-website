/* eslint-disable class-methods-use-this */
/* eslint-disable max-lines-per-function */

import GraphQLAPIMapper from "../graphQLAPIMapper"
import {
  mapPaperProposals,
  mapUpgradeProposals,
  mapParticipantProposals,
  mapTokenActionProposals,
  mapThreadProposals,
  mapVouchers
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

  // Map all proposal types to a single array to be written to global state
  mapProposals(rawProposals) {
    if (!rawProposals || rawProposals.length < 1) return [];
    return [
      ...mapPaperProposals(rawProposals.paperProposals),
      ...mapUpgradeProposals(rawProposals.upgradeProposals),
      ...mapParticipantProposals(rawProposals.participantProposals),
      ...mapTokenActionProposals(rawProposals.tokenActionProposals),
      ...mapThreadProposals(rawProposals.threadProposals),
    ];
  }
}

export default TheGraphAPIMapper;
