import BaseProposal from "./baseProposal";

/**
 * Dissolution Proposal model.
*/

export default class DissolutionProposal extends BaseProposal{

  // Default attribute that define the "empty" state.
  defaults() {
    return {
      id: null,
      thread: [],
      token: "",
      price: null
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
  //   token,
  //   price
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
  //   this.token = token;
  //   this.price = price
  // }
}