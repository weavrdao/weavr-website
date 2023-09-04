import {BaseProposal} from "@/data/network/web3/events/proposals/BaseProposal";
import {VoteType} from "@/models/vote";

export class DissolutionProposal extends BaseProposal {
  constructor(baseProposal, data) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const { purchaser, token, purchaseAmount} = data
    this.purchaser = purchaser
    this.token = token
    this.purchaseAmount = purchaseAmount
  }

  addVote(vote) {
    if(vote.voteDirection === 0) {
      vote.voteDirection = VoteType.Abstain
    } else if (vote.voteDirection === 1) {
      vote.voteDirection = VoteType.Yes
    } else  {
      vote.voteDirection = VoteType.No
    }
    this.votes.push(vote)
  }
}