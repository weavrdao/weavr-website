import {ethers } from 'ethers';
import WEAVR from "../contracts/abi/Frabric.json"
import {CONTRACTS} from "@/services/constants"
import ThreadDeployer from "../contracts/abi/ThreadDeployer.json"
import Crowdfund from "../contracts/abi/Crowdfund.json"
import {Needle, Thread} from "./marketplace/Asset"
import {BaseProposal} from "@/data/network/web3/events/proposals/BaseProposal";
import {TokenActionProposal} from "@/data/network/web3/events/proposals/TokenActionProposal";
import {ParticipantProposal} from "@/data/network/web3/events/proposals/ParticipantProposal";
import {ThreadProposal} from "@/data/network/web3/events/proposals/ThreadProposal";
import {UpgradeProposal} from "@/data/network/web3/events/proposals/UpgradeProposal";
import {ParticipantRemovalProposal} from "@/data/network/web3/events/proposals/ParticipantRemovalProposal";
import {Vote} from "@/models/vote";
import {ProposalState, ProposalTypes, CrowdfundState} from "@/models/common";
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
    this.proposals = null
  }

  // Gets all proposals, and ensures that current proposals are updated
  async syncProposals(assetId) {
    let blockNumber;
    const currentBlockNumber = await this.provider.getBlockNumber();
// Listen for all events emitted by the contract, starting from the specified block number
    blockNumber = this.startBlockNumber;
    console.log(blockNumber)
    console.log(currentBlockNumber)
    if (this.proposals === null) {
      this.proposals = {}
      await this.getProposals(assetId, this.proposals, blockNumber, currentBlockNumber)
      await this.processProposalTypeData(assetId, this.proposals, blockNumber, currentBlockNumber)
      await this.updateProposalsWithVotes(assetId, this.proposals, blockNumber, currentBlockNumber)
      await this.processProposalStatusChanges(assetId, this.proposals, blockNumber, currentBlockNumber)
      await this.finalizeProposals(this.proposals)
    }
    return Object.values(this.proposals)
  }

  async getProposals(assetId, proposals, blockNumber, currentBlockNumber) {
    const weavr_contract = new ethers.Contract(assetId, this.weavr_abi, this.provider);
    const weavr_iface = new ethers.utils.Interface(this.weavr_abi);

    await weavr_contract.queryFilter("Proposal").then(async (raw_events) => {
      for (const raw_event of raw_events) {
        const event = weavr_iface.decodeEventLog("Proposal", raw_event.data, raw_event.topics)
        const block = await this.provider.getBlock(raw_event.blockNumber)
        const proposal = new BaseProposal(event.id.toNumber(), event.creator, event.info, event.supermajority, block.timestamp)
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
            prop.type = this.proposalTypeSwitch[proposalTypeName].type
            proposals[event.id] = new this.proposalTypeSwitch[proposalTypeName].cls(prop, event)
          }
        }
      })
    }
  }

  async processProposalStatusChanges(assetId, proposals, syncBlockNumber, currentBlockNumber) {
    const weavr_contract = new ethers.Contract(assetId, this.weavr_abi, this.provider);
    const weavr_iface = new ethers.utils.Interface(this.weavr_abi);
    await weavr_contract.queryFilter("ProposalStateChange", syncBlockNumber, currentBlockNumber).then(async (raw_events) => {
      for (const raw_event of raw_events) {
        const event = weavr_iface.decodeEventLog("ProposalStateChange", raw_event.data, raw_event.topics)
        if (event.id in proposals) {
          proposals[event.id].status = ProposalState[event.state]
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

  async fetchNeedles() {
    const threadDeployer = new ethers.Contract(CONTRACTS.THREAD_DEPLOYER, ThreadDeployer.abi, this.provider)
    /**
       * Fetch Thread specific data
       */
    let threadMap = new Map();
    await threadDeployer.queryFilter(threadDeployer.filters.Thread()).then( (rawThreads) => {
      rawThreads.map( t => {
        threadMap.set(t.args.thread, { thread: t.args.thread, governor: t.args.governor, variant: t.args.variant, descriptor: t.args.descriptor })
      })
    })
    console.log("ARGS", threadMap);
    const crowdfundEvents = (await threadDeployer.queryFilter(threadDeployer.filters.CrowdfundedThread()))
    /**
     * fetch Crowdfund specific data
     */
    let crfMap = []
    console.log("CROWDFUNDED NEEDLES:::::", crowdfundEvents);
    const NEEDLES = crowdfundEvents.map( async (crf) => {
      const {crowdfund, target, thread, token} = crf.args
      const crowdfundSC = new ethers.Contract(crowdfund, Crowdfund.abi, this.provider)
      const stateEvent = await crowdfundSC.queryFilter(crowdfundSC.filters.StateChange())
      const state = stateEvent[stateEvent.length-1].args['state']
      
      const depositEvent = await crowdfundSC.queryFilter(crowdfundSC.filters.Deposit())
      let deposited = ethers.BigNumber.from("0")
      const deposits = depositEvent.map( dep => {
        const amount = dep.args['amount'].toString()
        const id = `${dep.args['depositor']}_${dep.args['amount']}`
        deposited = deposited.add(dep.args['amount'])
        return new Deposit(id, dep.args['depositor'], dep.args['amount'])
      })

      const withdrawalsEvent = await crowdfundSC.queryFilter(crowdfundSC.filters.Withdraw())
      let withdrew = ethers.BigNumber.from("0")
      const withdrawals = withdrawalsEvent.map( dep => {
        const amount = dep.args['amount'].toString()
        const id = `${dep.args['depositor']}_${dep.args['amount']}`
        withdrew = withdrew.add(dep.args['amount'])
        return new Deposit(id, dep.args['depositor'], dep.args['amount'])
      })

      const DistributionEvent = await crowdfundSC.queryFilter(crowdfundSC.filters.Distribution())
      
      const distributions = DistributionEvent.map( dep => {
        const id = `${dep.args['depositor']}_${dep.args['amount']}`
        return new Deposit(id, dep.args['depositor'], dep.args['amount'])
      })
      // deposited = deposited.sub(withdrew)


      
      // console.log(threadEvents);
      // console.log(threadEvents[0].args.thread);
      // const t = threadEvents.find( t => {t.args.thread == thread})
      // console.log("t____", t);
      console.log(threadMap.get(thread).descriptor);
      const needle = new Needle(
        crowdfund,
        CrowdfundState[state],  
        threadMap.get(thread).descriptor,
        threadMap.get(thread).descriptor,
        deposited,
        target,
        deposits,
        withdrawals,
        distributions,
        token
      )
      console.log(needle);
      crfMap.push(needle)
      return needle
    })
    
    return Promise.all(NEEDLES).then(res => {
      console.log(res)
      return res
    })
  }
}

class Deposit {
  constructor(id, depositor, amount) {
    this.id = id
    this.depositor = depositor
    this.amount = amount
  }
}


export default InfuraEventCacheClient;