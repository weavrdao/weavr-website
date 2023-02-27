import {ethers } from 'ethers';
import WEAVR from "../contracts/abi/Frabric.json"
import {PaperProposal} from "@/data/network/web3/events/proposals/PaperProposal";
import {TokenActionProposal} from "@/data/network/web3/events/proposals/TokenActionProposal";
import {ParticipantProposal} from "@/data/network/web3/events/proposals/ParticipantProposal";
import {ThreadProposal} from "@/data/network/web3/events/proposals/ThreadProposal";
import {UpgradeProposal} from "@/data/network/web3/events/proposals/UpgradeProposal";
import {ParticipantRemovalProposal} from "@/data/network/web3/events/proposals/ParticipantRemovalProposal";
import {Vote} from "@/models/vote";
import {ProposalState, ProposalTypes} from "@/models/common";
import {getIpfsHashFromBytes32} from "@/data/network/storage/ipfs/common";

class InfuraEventCacheClient {
  constructor(ProviderNetwork, ProviderApiKey, startBlockNumber) {
    this.provider = new ethers.providers.InfuraProvider(ProviderNetwork, ProviderApiKey);
    this.weavr_abi = WEAVR.abi;
    this.startBlockNumber = startBlockNumber;
    this.proposalTypeSwitch = {
      "TokenActionProposal": {cls: TokenActionProposal, type: ProposalTypes.TokenAction},
      "UpgradeProposal": {cls: UpgradeProposal, type: ProposalTypes.Upgrade},
      "ThreadProposal": {cls: ThreadProposal, type: ProposalTypes.Thread},
      "ParticipantProposal": {cls: ParticipantProposal, type: ProposalTypes.Participant},
      "ParticipantRemovalProposal": {cls: ParticipantRemovalProposal, type: ProposalTypes.ParticipantRemoval}
    }
  }

  // Gets all proposals, and ensures that current proposals are updated
  async syncProposals(assetId, localCache) {
    let blockNumber;
    const syncBlockNumber = parseInt(localCache.getItem("syncBlockNumber"));
    let proposals = localCache.getItem("proposals") ? JSON.parse(localCache.getItem("proposals")) : {}
    const currentBlockNumber = await this.provider.getBlockNumber();
// Listen for all events emitted by the contract, starting from the specified block number
    if(syncBlockNumber !== null) {
      blockNumber = syncBlockNumber;
    } else {
      blockNumber = this.startBlockNumber;
    }
    console.log(proposals)
    console.log(blockNumber)
    console.log(currentBlockNumber)
    await this.getProposals(assetId, proposals, blockNumber, currentBlockNumber)
    await this.processProposalTypeData(assetId, proposals, blockNumber, currentBlockNumber)
    await this.updateProposalsWithVotes(assetId, proposals, blockNumber, currentBlockNumber)
    await this.processProposalStateChanges(assetId, proposals, blockNumber, currentBlockNumber)
    await this.finalizeProposals(proposals)
    localCache.setItem("proposals", JSON.stringify(proposals))
    localCache.setItem("syncBlockNumber", currentBlockNumber)
    return Object.values(proposals)
  }

  async getProposals(assetId, proposals, blockNumber, currentBlockNumber) {
    const weavr_contract = new ethers.Contract(assetId, this.weavr_abi, this.provider);
    const weavr_iface = new ethers.utils.Interface(this.weavr_abi);

    await weavr_contract.queryFilter("Proposal", blockNumber, currentBlockNumber).then(async (raw_events) => {
      for (const raw_event of raw_events) {
        const event = weavr_iface.decodeEventLog("Proposal", raw_event.data, raw_event.topics)
        const block = await this.provider.getBlock(raw_event.blockNumber)
        const proposal = new PaperProposal(event.id.toNumber(), event.creator, event.info, event.supermajority, block.timestamp)
        proposals[proposal.id] = proposal
      }
      // Filter out only the events that are important to you
    })
  }

  async finalizeProposals(proposals) {
    for (const id of Object.keys(proposals)) {
      if (!("endTimestamp" in proposals[id])) {
        proposals[id].endTimestamp = proposals[id].startTimestamp + 60 * 60 * 24 * 7
        proposals[id].info = getIpfsHashFromBytes32(proposals[id].info)
        if (proposals[id].type === ProposalTypes.Thread) {
          proposals[id].descriptor = getIpfsHashFromBytes32(proposals[id].descriptor)
        }
      }
    }
  }

  async processProposalTypeData(assetId, proposals, syncBlockNumber, currentBlockNumber) {
    const weavr_contract = new ethers.Contract(assetId, this.weavr_abi, this.provider);
    const weavr_iface = new ethers.utils.Interface(this.weavr_abi);
    for (const proposalTypeName of Object.keys(this.proposalTypeSwitch)) {
      await weavr_contract.queryFilter(proposalTypeName, syncBlockNumber, currentBlockNumber).then(async (raw_events) => {
        for (const raw_event of raw_events) {
          const event = weavr_iface.decodeEventLog(proposalTypeName, raw_event.data, raw_event.topics)
          if (event.id in proposals) {
            const prop = proposals[event.id]
            const state = {votes: prop.votes, type: this.proposalTypeSwitch[proposalTypeName].type, status: prop.status}
            proposals[event.id] = new this.proposalTypeSwitch[proposalTypeName].cls(proposals[event.id], event, state)
          }
        }
      })
    }
  }

  async processProposalStateChanges(assetId, proposals, syncBlockNumber, currentBlockNumber) {
    const weavr_contract = new ethers.Contract(assetId, this.weavr_abi, this.provider);
    const weavr_iface = new ethers.utils.Interface(this.weavr_abi);
    await weavr_contract.queryFilter("ProposalStateChange", syncBlockNumber, currentBlockNumber).then(async (raw_events) => {
      for (const raw_event of raw_events) {
        const event = weavr_iface.decodeEventLog("ProposalStateChange", raw_event.data, raw_event.topics)
        if (event.id in proposals) {
          proposals[event.id].state = ProposalState[event.state]
        } else {
          throw new Error(`Got ProposalStateChange for proposal ${event.id} but no proposal exists with that id`);
        }
      }
      // Filter out only the events that are important to you
    })
  }

  async updateProposalsWithVotes(assetId, proposals, syncBlockNumber, currentBlockNumber) {
    const weavr_contract = new ethers.Contract(assetId, this.weavr_abi, this.provider);
    const weavr_iface = new ethers.utils.Interface(this.weavr_abi);
    await weavr_contract.queryFilter("Vote", syncBlockNumber, currentBlockNumber).then(async (events) => {
      for (const event_data of events) {
        const event = weavr_iface.decodeEventLog("Vote", event_data.data, event_data.topics)
        if (event.id in proposals) {
          const vote = new Vote(event.id, event.voter, event.direction, event.votes)
          proposals[event.id].addVote(vote)
        } else {
          throw new Error(`Got Vote for proposal ${event.id} but no proposal exists with that id`);
        }
      }
    })
  }
}

export default InfuraEventCacheClient;