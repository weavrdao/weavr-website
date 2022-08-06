import BaseProposal from "./baseProposal";

/**
 * Proposal model.
 * @property {string} id ID of the proposal
 * @property {string} creatorAddress Address of the proposal creator
 * @property {number} startTimestamp Unix timestamp marking the start of the voting window
 * @property {number} endTimestamp Unix timestamp marking the end of the voting window
 * @property {Vote[]} votes Votes posted on the proposal
 * @property {bool} supermajority Signal if the supermagiority is required or not
 * @property {string} governor Governor for the thread
 * @property {string} description Description of the proposal
 * @property {string} name Name of the thread
 * @property {string} symbol Symbol of the thread
 * @property {string} data
 * 
*/

class ThreadProposal extends BaseProposal{
  defaults(){
    return {
      id: null,
      frabric: [],
      governor: "",
      name: "",
      symbol: "",
      descriptor: "",
      data: ""
    }
  }
  // constructor(
  //   id,
  //   thread,
  //   frabric,
  //   creator,
  //   type,
  //   state,
  //   votes,
  //   supermajority,
  //   startTimestamp,
  //   endTimestamp,
  //   description,
  //   governor,
  //   name,
  //   symbol,
  //   descriptor,
  //   data
  // ) {
  //   super(
  //     id,
  //     thread,
  //     frabric,
  //     creator,
  //     type,
  //     state,
  //     votes,
  //     supermajority,
  //     startTimestamp,
  //     endTimestamp
  //   );
  //   this.description = description;
  //   this.name = name;
  //   this.symbol = symbol;
  //   this.descriptor = descriptor;
  //   this.data = data;
  //   this.governor = governor;
  // }
}




export default {ThreadProposal}