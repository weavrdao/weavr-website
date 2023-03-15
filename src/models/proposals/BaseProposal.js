import {ProposalState, ProposalTypes} from "@/models/common";
import {VoteType} from "@/models/vote";

export class BaseProposal {
  constructor (id, creator, info, superMajority, startTimestamp,
    status, type, votes) {
    this.id = id;
    this.creator = creator;
    this.info = info;
    this.superMajority = superMajority;
    this.startTimestamp = startTimestamp
    if(!status) {
      this.status = ProposalState.Active
    } else {
        this.status = status
    }
    if(!type) {
        this.type = ProposalTypes.Paper
    } else {
        this.type = type
    }
    if(!votes) {
        this.votes = []
    } else {
        this.votes = votes
    }

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

// export default BasicProposal