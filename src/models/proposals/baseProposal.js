/* eslint-disable class-methods-use-this */
import { Model } from "vue-mc"
import { ProposalTypes } from "../common";
/**
 * Proposal model.
 * @property {string} id ID of the proposal
 * @property {string} creatorAddress Address of the proposal creator
 * @property {number} startTimestamp Unix timestamp marking the start of the voting window
 * @property {number} endTimestamp Unix timestamp marking the end of the voting window
 * @property {Vote[]} votes Votes posted on the proposal
 * @property {bool} supermajority signals if the supermagiority is required or not
 * @property {string} state Current state of the proposal
 * @property {string} info ipfs hash of proposal information
 * @property {ProposalTypes} type Type of proposal this is
 */
class BaseProposal extends Model{
  defaults() {
    return {
      id: null,
      creatorAddress: null,
      startTimestamp: null,
      endTimestamp: null,
      votes: null,
      supermajority: null,
      state: "",
      info: "",
      type: "",
    }
  }

  methods() {
    return {
      fetch() {

      }
    }
  }
}

export default { BaseProposal }