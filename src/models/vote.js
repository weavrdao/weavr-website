import { ethers } from "ethers";

/**
 * Vote model.
 */

export class Vote {
  constructor({
    id,
    voter,
    voteDirection,
    count,
  }) {
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
