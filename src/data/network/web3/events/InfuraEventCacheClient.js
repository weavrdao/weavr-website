import {ethers } from "ethers";
import {CONTRACTS} from "@/services/constants"
import {getIpfsHashFromBytes32} from "@/data/network/storage/ipfs/common";
import {Needle, Thread} from "./marketplace/Assets"
import {Marketplace} from "./marketplace/marketplace"
import {Vote} from "@/models/vote";
import {ProposalState, ProposalTypes, CrowdfundState} from "@/models/common";

import {Crowdfund, ThreadDeployer, FrabricERC20, WEAVR} from "../contracts/abi"
import {
  BaseProposal, 
  TokenActionProposal, 
  ParticipantProposal, 
  ParticipantRemovalProposal, 
  ThreadProposal, 
  UpgradeProposal
} from "@/models/proposals";

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
    this.proposals = null;
    /** 
     * 
     * @dev assets : Map()
     * basic asset list with minimal attributus used to build neddles and threads upon
     * 
     * */ 
    this.assets = null 
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
        threads.set(t.args.thread, { id: t.args.thread, governor: t.args.governor, descriptor: t.args.descriptor, erc20: t.args.erc20 })
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
        descriptor: asset.thread.descriptor,
        erc20: asset.thread.erc20
      }
    })
    this.assets = assets
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
    return Promise.all(NEEDLES).then(res => {
      console.log(res)
      return res
    })
  }
  
  async fetchThreads() {
    let threads = [];
    const assets = await this.getAssets(true)
    const transfersMap = await this.mapHoldersForAllThreads(this.assets)
    console.log(transfersMap);
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
        { id: erc20, holders:transfersMap.get(thread)}
      )
      threads.push(_thread)
    })
    return threads
  }
  async mapHoldersForAllThreads(assets) {
    let transfersMap = new Map()
    for(let asset of assets) {
      const erc20Holders = await this.fetchFerc20(asset.erc20)
      transfersMap.set(asset.id, erc20Holders)
    }
    return transfersMap
  }
  async fetchFerc20(erc20) {
    const ferc20_contract = new ethers.Contract(erc20, FrabricERC20.abi, this.provider);
    const ferc20_iface = new ethers.utils.Interface(FrabricERC20.abi);
    const ferc20TxEvents = await ferc20_contract.queryFilter(ferc20_contract.filters.Transfer())
    const to = new Set()
    const from =  new Set()
    ferc20TxEvents.map( event => {
      const data = ferc20_iface.decodeEventLog("Transfer", event.data, event.topics)
      to.add(data.to)
      from.add(data.from)
    })
    const holdersMap = new Map()
    ferc20TxEvents.map( event => {
      const tx = ferc20_iface.decodeEventLog("Transfer", event.data, event.topics)
      for(let holderAddress of to.values()){
        let holder = new Holder(holderAddress)
        tx.to == holderAddress ? holder.to.push(new ERC20_TX(tx.to, tx.from, tx.value, event.transactionHash)) : null
        tx.from == holderAddress ? holder.from.push(new ERC20_TX(tx.to, tx.from, tx.value, event.transactionHash)) : null
        holdersMap.set(holderAddress, holder)
      }
    })
    return holdersMap
  }

}
class Holder {
  
  constructor(address) {
    this.id = address
    this.to = []
    this.from = []
  }
}
class ERC20_TX {
  constructor(to, from, value, transactionHash ) {
    this.id = `${to}_${from}_${transactionHash}`
    this.to = to;
    this.from = from
    this.value = value
    this.transactionHash = transactionHash
  }
}


export default InfuraEventCacheClient;