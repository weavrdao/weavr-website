import {BaseProposal} from "./BaseProposal";

export class TokenActionProposal extends BaseProposal {
  constructor(baseProposal, payload) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const {token, target, mint, price, amount} = payload
    this.token = token
    this.target = target
  this.mint = mint
  this.price = price
  this.amount = amount
  }

}