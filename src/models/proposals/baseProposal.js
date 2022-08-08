/* eslint-disable class-methods-use-this */
import { Model } from "vue-mc"
/**
 * Proposal model.
 * @property {string} id ID of the proposal
 * @property {string} creatorAddress Address of the proposal creator
 * @property {number} startTimestamp Unix timestamp marking the start of the voting window
 * @property {number} endTimestamp Unix timestamp marking the end of the voting window
 * @property {Vote[]} votes Votes posted on the proposal
 * @property {bool} supermajority signals if the supermagiority is required or not
 */
/*
id: ID!
thread: Thread
frabric: Frabric
creator: Bytes!
type: Int!
state: ProposalState!
votes: [Vote!]!
info: Bytes!
supermajority: Boolean!
startTimestamp: Int!
endTimestamp: Int!
*/
class BaseProposal extends Model{
  defaults() {
    return {
      id: null,
      creatorAddress: null,
      startTimestamp: null,
      endTimestamp: null,
      votes: null,
      supermajority: null
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