import BaseProposal from "./proposals/baseProposal";

/**
 * Vote model.
 * @property {string} voterAddress Address of the voter
 * @property {number} count Voting power of the voter
 */

export class Vote extends BaseProposal {

  // Default attributes that define the "empty" state.
  defaults() {
    return {
      voter: "",
      voteDirection: null,
      count: null,
    }
  }
}

const VoteType = {
  Yes: "Yes",
  No: "No",
  Abstain: "Abstain"
}

export { VoteType }
