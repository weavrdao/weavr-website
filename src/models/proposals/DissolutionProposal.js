import {BaseProposal} from "@/models/proposals/BaseProposal";
import {VoteType} from "@/models/vote";

export class DissolutionProposal extends BaseProposal {
  constructor(baseProposal, data) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const { token, purchaseAmount } = data
    this.token = token
    this.purchaseAmount = purchaseAmount
  }
}