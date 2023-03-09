import {BaseProposal} from "@/data/network/web3/events/proposals/BaseProposal";
import {VoteType} from "@/models/vote";
import {BigNumber} from "ethers";

export class UpgradeProposal extends BaseProposal {
  constructor(baseProposal, _data) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const {beacon, instance, version, code, data} = _data
    this.beacon = beacon
    this.instance = instance
    this.version = version
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