import {ProposalState, ProposalTypes} from "@/models/common";
import {VoteType} from "@/models/vote";

export class PaperProposal {
  constructor (id, creator, info, superMajority, startTimestamp, state = {}) {
    this.id = id;
    this.creator = creator;
    this.info = info;
    this.superMajority = superMajority;
    this.startTimestamp = startTimestamp
    if ("votes" in state) {
      this.votes = state.votes
    } else {
      this.votes = []
    }
    if ("status" in state) {
      this.status = state.status

    } else {
      this.status = ProposalState.Active
    }
    if ("type" in state) {
      this.type = state.type
    } else {
      this.type = ProposalTypes.Paper;
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