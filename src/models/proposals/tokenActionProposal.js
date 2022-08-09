/* eslint-disable class-methods-use-this */
import BaseProposal from "./baseProposal";

/**
 * Token Action Proposal model.
*/

export default class TokenActionProposal extends BaseProposal {

  // Default attributes that define the "empty" state.
  defaults() {
    return {
      amount: "",
      mint: null,
      price: "",
      target: "",
      token: "",
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
  //   target,
  //   mint,
  //   price,
  //   amount
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
  //   this.target = target;
  //   this.mint = mint;
  //   this.price = price;
  //   this.amount = amount;
  // }
}
