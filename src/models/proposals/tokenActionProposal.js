/* eslint-disable class-methods-use-this */
import BaseProposal from "./baseProposal";

/**
 * Proposal model.
 * @property {string} id ID of the proposal
 * @property {string} creatorAddress Address of the proposal creator
 * @property {number} startTimestamp Unix timestamp marking the start of the voting window
 * @property {number} endTimestamp Unix timestamp marking the end of the voting window
 * @property {Vote[]} votes Votes posted on the proposal
 * @property {bool} supermajority Signal if the supermagiority is required or not
 * @property {string} description Description of the proposal
 * @property {string} token Name of the thread
 * @property {string} target Symbol of the thread
 * @property {boolean} mint
 * @property {number} price
 * @property {number} amount
*/

export class TokenActionProposal extends BaseProposal {
  defaults() {
    return {
      amount: "",
      mint: null,
      price: "",
      target: "",
      token: "",
    }
  }
}
