import BaseProposal from "./baseProposal";

/**
 * Proposal model.  
*/

export default class DescriptorChangeProposal extends BaseProposal{

  // Default attributes that define the "empty" state.
  defaults() {
    return {
      id: null,
      thread: [],
      descriptor: ""
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
  //   descriptor
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
  //   this.descriptor = descriptor;
  // }
}