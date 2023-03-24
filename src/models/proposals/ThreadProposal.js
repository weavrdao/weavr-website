import {BaseProposal} from "./BaseProposal";
import {VoteType} from "@/models/vote";

export class ThreadProposal extends BaseProposal {
  constructor(baseProposal, _data) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const {variant, governor, name, symbol, descriptor, data} = _data
    this.variant = variant
    this.governor = governor
    this.name = name
    this.symbol = symbol
    this.descriptor = descriptor
    this.data = data
  }
}