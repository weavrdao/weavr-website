import {PaperProposal} from "@/data/network/web3/events/proposals/PaperProposal";
import {VoteType} from "@/models/vote";

export class UpgradeProposal extends PaperProposal {
  constructor(baseProposal, _data, state) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority, baseProposal.startTimestamp, state)
    const {beacon, instance, version, code, data} = _data
    this.beacon = beacon
    this.instance = instance
    this.version = version.toNumber()
    this.code = code
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