import {PaperProposal} from "@/data/network/web3/events/proposals/PaperProposal";
import {VoteType} from "@/models/vote";

export class ThreadProposal extends PaperProposal {
  constructor(baseProposal, _data, state) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority, baseProposal.startTimestamp, state)
    const {variant, governor, name, symbol, descriptor, data} = _data
    this.variant = variant
    this.governor = governor
    this.name = name
    this.symbol = symbol
    this.descriptor = descriptor
    this.data = data
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