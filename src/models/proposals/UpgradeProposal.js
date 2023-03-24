import {BaseProposal} from "./BaseProposal";
import {VoteType} from "@/models/vote";

export class UpgradeProposal extends BaseProposal {
  constructor(baseProposal, _data) {
    super(baseProposal.id, baseProposal.creator, baseProposal.info, baseProposal.superMajority,
      baseProposal.startTimestamp, baseProposal.status, baseProposal.type, baseProposal.votes)
    const {beacon, instance, version, code, data} = _data
    this.beacon = beacon
    this.instance = instance
    this.version = version
    this.code = code
    this.data = data
  }
}