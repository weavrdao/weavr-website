import BaseProposal from "./proposals/baseProposal";

/**
 * Vote model.
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
