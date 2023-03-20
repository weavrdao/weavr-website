import { ethers } from "ethers";

/**
 * Vote model.
 * @property {string} proposalID ID of the proposal this vote belongs to
 * @property {string} voterAddress Address of the voter
 * @property {VoteType} type Type of the vote posted
 * @property {number} count Voting power of the voter
 */

export class Vote {
  constructor(
    id,
    voter,
    voteDirection,
    count,
  ) {
    this.id = id;
    this.voter = voter;
    this.voteDirection = voteDirection;
    this.count = ethers.utils.formatEther(count);
  }
}

export const VoteType = {
  Yes: "Yes",
  No: "No",
  Abstain: "Abstain"
}
