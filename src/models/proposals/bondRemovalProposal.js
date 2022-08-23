import BaseProposal from "./baseProposal";

/**
 * Bond Removal Proposal model.
*/

export default class BondRemovalProposal extends BaseProposal {

  // Default attributes that define the "empty" state.
  defaults() {
    return {
      id: null,
      frabric: [],
      participant: "",
      slash: false,
      amount: null,
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
  //   participant,
  //   slash,amount
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
  //   this.participant = participant;
  //   this.slash = slash;
  //   this.amount = amount;
  // }
}