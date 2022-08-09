import BaseProposal from "./baseProposal";

/**
 * Thread Proposal Proposal model.
*/

export default class ThreadProposalProposal extends BaseProposal{

  // Default attributes that define the "empty" state.
  defaults(){
    return {
      id: null,
      frabric: [],
      thread: "",
      info: ""
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
  //   newThread
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
  //   this.newThread = newThread
  // }
}