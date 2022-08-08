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
 * @property {string} title Title of the proposal
 * @property {string} description Description of the proposal
*/

class PaperProposal extends BaseProposal{
  defaults() {
    return {
      
    }
  }
}


export default {PaperProposal}