import {ethers } from "ethers";
import WEAVR from "../contracts/abi/Frabric.json"
import {CONTRACTS} from "@/services/constants"
import ThreadDeployer from "../contracts/abi/ThreadDeployer.json"
import Crowdfund from "../contracts/abi/Crowdfund.json"
import {Needle, Thread} from "./marketplace/Asset"
import {Marketplace} from "./marketplace/marketplace"
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
      await this.finalizeProposals(assetId, this.proposals)
    }
    return Object.values(this.proposals)
  }

  async getProposals(assetId, proposals, blockNumber, currentBlockNumber) {
    const weavr_contract = new ethers.Contract(assetId, this.weavr_abi, this.provider);
    const weavr_iface = new ethers.utils.Interface(this.weavr_abi);

    await weavr_contract.queryFilter("Proposal",blockNumber, currentBlockNumber).then(async (raw_events) => {
      for (const raw_event of raw_events) {
        const event = weavr_iface.decodeEventLog("Proposal", raw_event.data, raw_event.topics)
        const block = await this.provider.getBlock(raw_event.blockNumber)
        const proposal = new BaseProposal(event.id.toNumber(), event.creator, event.info, event.supermajority, block.timestamp)
        proposals[proposal.id] = proposal
      }
      // Filter out only the events that are important to you
    })
  }

  async finalizeProposals(assetId, proposals) {
    const weavr_contract = new ethers.Contract(assetId, this.weavr_abi, this.provider);
    const votingPeriod = await weavr_contract.votingPeriod()
    const vp = votingPeriod.toNumber()
    for (const id of Object.keys(proposals)) {
      if (!("endTimestamp" in proposals[id])) {
        proposals[id].endTimestamp = proposals[id].startTimestamp + vp
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

  /**
   * 
   * @param {bool} asThreads sets the map key with the thread address instead of the needle one
   * @default false returns asset map with crowdfund address as map key
   * @returns Map of the generic asset data, used to complete both needles and threads
   */
  async getAssets(asThreads) {
    const threadDeployer = new ethers.Contract(CONTRACTS.THREAD_DEPLOYER, ThreadDeployer.abi, this.provider)
    console.log(threadDeployer);
    let threads = new Map();
    await threadDeployer.queryFilter(threadDeployer.filters.Thread()).then( (rawThreads) => {
      rawThreads.map( t => {
        threads.set(t.args.thread, { id: t.args.thread, governor: t.args.governor, descriptor: t.args.descriptor })
      })
    })

    let assets = [];
    let crowdfunds = new Map()
    const cfEvents = await threadDeployer.queryFilter(threadDeployer.filters.CrowdfundedThread()).then(
      (rawCrowdfunds) => {
        rawCrowdfunds.map(rawEvent => {
          const td_iface = new ethers.utils.Interface(ThreadDeployer.abi);
          const event = td_iface.decodeEventLog("CrowdfundedThread", rawEvent.data, rawEvent.topics)
          crowdfunds.set(event.crowdfund, {id: event.crowdfund, thread: threads.get(event.thread)})    
        }
      )
    })
    for(let needle of crowdfunds.keys()){
      const crowdfundSC = new ethers.Contract(needle, Crowdfund.abi, this.provider)
      const state = await Marketplace.getNeedleState(crowdfundSC)
      crowdfunds.get(needle).state =CrowdfundState[state]
    }
    assets = Array.from(crowdfunds.values()).map( asset => {
      return {
        id: asThreads ? asset.thread.id : asset.id,
        state: asset.state,
        governor: asset.thread.governor,
        descriptor: asset.thread.descriptor
      }
    })
    return assets
  }

  async fetchNeedles() {
    let crowdfunds = [];
    this.needles = await this.getAssets()
    const threadDeployer = new ethers.Contract(CONTRACTS.THREAD_DEPLOYER, ThreadDeployer.abi, this.provider)
    const crowdfundEvents = (await threadDeployer.queryFilter(threadDeployer.filters.CrowdfundedThread()))
    
 
    const NEEDLES = crowdfundEvents.map( async (crf) => {
      const {crowdfund, target, token} = crf.args
      const crowdfundSC = new ethers.Contract(crowdfund, Crowdfund.abi, this.provider)
    
      const {deposits, deposited} = await Marketplace.getNeedleDeposits(crowdfundSC)
      const {withdrawals, withdrew} = await Marketplace.getNeedleWithdrawals(crowdfundSC)
      const distributions = await Marketplace.getNeedleDestribuition(crowdfundSC)
     
      const actualDeposits = deposited.sub(withdrew)
     
      const asset = this.needles.find(a => a.id==crowdfund)
      const needle = new Needle(
        crowdfund,
        asset.state,  
        asset.governor,
        asset.descriptor,
        actualDeposits,
        target,
        deposits,
        withdrawals,
        distributions,
        token
      )
      crowdfunds.push(needle)
      return needle
    })
    console.log("CROWDFUNDS__________________________", crowdfunds);
    return Promise.all(NEEDLES).then(res => {
      console.log(res)
      return res
    })
  }
  
  async fetchThreads() {
    let threads = [];
    const assets = await this.getAssets(true)
    const threadDeployer = new ethers.Contract(CONTRACTS.THREAD_DEPLOYER, ThreadDeployer.abi, this.provider)
    const threadEvents = await threadDeployer.queryFilter(threadDeployer.filters.Thread())
    threadEvents.map( async (trd) => {
      const {thread, governor, descriptor, variant, erc20} = trd.args
      const state = assets.find( a => a.id == thread).state
      const _thread = new Thread(
        thread,
        state,  
        governor,
        descriptor,
        variant,
        erc20
      )
      threads.push(_thread)
    })
    return threads
  }
  
}




export default InfuraEventCacheClient;