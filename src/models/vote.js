/* eslint-disable class-methods-use-this */
import { Collection, Model } from "vue-mc";
import { ethers } from "ethers";

/**
 * Vote model.
 */

export class Vote extends Model {
  // Default attributes that define the "empty" state.
  defaults() {
    return {
      voter: "",
      voteDirection: null,
      count: null,
    }
  }
}

export const VoteType = {
  Yes: "Yes",
  No: "No",
  Abstain: "Abstain"
}
