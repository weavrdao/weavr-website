import BaseProposal from "./baseProposal";

/**
 * Frabric Change Proposal model.
*/

export default class FrabricChangeProposal extends BaseProposal{

  // Default attributes that define the "empty" state.
  defaults () {
    return {
      id: null,
      thread: [],
      frabric: "",
      governor: "",
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
  //   newFrabric,
  //   governor
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
  //   this.newFrabric = newFrabric;
  //   this.governor = governor;
  // }
}