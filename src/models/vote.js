/* eslint-disable class-methods-use-this */
import { Model } from "vue-mc";
import BaseProposal from "./proposals/baseProposal";

/**
 * Vote model.
 * @property {string} voterAddress Address of the voter
 * @property {VoteType} voteDirection Type of the vote posted
 * @property {number} count Voting power of the voter
 */
export class Vote extends Model {
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
