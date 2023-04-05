import {ethers} from "ethers";
import {CONTRACTS} from "@/services/constants"
import {getIpfsHashFromBytes32} from "@/data/network/storage/ipfs/common";
import {ERC20_TX, Holder, Needle, Thread} from "@/models/Assets"
import {Marketplace} from "./marketplace/marketplace"
import {Vote} from "@/models/vote";
import {CrowdfundState, ProposalState, ProposalTypes} from "@/models/common";
import {CrowdfundJSON, FrabricERC20JSON, ThreadDeployerJSON, ThreadJSON, WEAVRJSON} from "../contracts/abi"
import {
  BaseProposal,
  DescriptorChangeProposal,
  ParticipantProposal,
  ParticipantRemovalProposal,
  ThreadProposal,
  TokenActionProposal,
  UpgradeProposal
} from "@/models/proposals";


class InfuraEventCacheClient {
  constructor(ProviderNetwork, ProviderApiKey, startBlockNumber) {
    this.provider = new ethers.providers.InfuraProvider(ProviderNetwork, ProviderApiKey);
    this.weavr_abi = WEAVRJSON.abi;
    this.contract = null;
    this.iface = null;
    this.startBlockNumber = startBlockNumber;
    this.proposalTypeSwitch = {}
    this.proposals = new Map()
    this.assets = null 
  }

  // Gets all proposals, and ensures that current proposals are updated
  async syncProposals(assetId, isThread = false) {
    let blockNumber;
    const currentBlockNumber = await this.provider.getBlockNumber();
    // Listen for all events emitted by the contract, starting from the specified block number
    blockNumber = this.startBlockNumber;
    let iface = isThread === true ? new ethers.utils.Interface(ThreadJSON.abi) : new ethers.utils.Interface(WEAVRJSON.abi)
    let {events, votingPeriod} = await this.getEventsForAsset(assetId, iface, isThread, blockNumber, currentBlockNumber)
    let proposals = await this.getProposals(events)
    proposals = this.processProposalTypeData(events, proposals)
    proposals = this.updateProposalsWithVotes( events, proposals)
    proposals = this.processProposalStatusChanges(events, proposals)
    proposals = this.finalizeProposals(proposals, votingPeriod)
      
    return Array.from(Object.values(proposals))
  }

  async getEventsForAsset(assetId, iface, isThread, blockNumber, currentBlockNumber) {
    this.selectAssetTypeContract(assetId, isThread)
    let eventNames = [
      ...Object.keys(this.proposalTypeSwitch),
      "Proposal",
      "Vote",
      "ProposalStateChange",
    ]
    let events = eventNames.map((eventName) => {
      return this.contract.queryFilter(eventName, blockNumber, currentBlockNumber).then(async (raw_events) => {
        const eventSignature = iface.getEventTopic(eventName);
        let this_events = []
        for (const raw_event of raw_events) {
          for (let i = 0; i < raw_event.topics.length; i++) {
            if (raw_event.topics[i] === eventSignature) {
              const event = iface.decodeEventLog(eventName, raw_event.data, raw_event.topics)
              let timestamp;
              if( eventName === "Proposal") {
                timestamp = (await this.provider.getBlock(raw_event.blockNumber)).timestamp
              } else {
                timestamp = null;
              }
              this_events.push({event, timestamp})
            }
          }
        }
        return this_events
      })
    })
    let awaited_events = await Promise.all(events)
    let votingPeriod = await this.contract.votingPeriod()
    let output = {}
    for (let i = 0; i < eventNames.length; i++) {
      output[eventNames[i]] = awaited_events[i]
    }
    return {output, votingPeriod}
  }

  async getProposals(events) {
    let proposals = {}
    events["Proposal"].forEach(obj => {
      const {event, timestamp} = obj
      const id = event.id.toNumber()
      proposals[id] =  new BaseProposal(event.id.toNumber(), event.creator, event.info, event.supermajority, timestamp)
    })
    console.log(proposals)
    return proposals
  }

  processProposalTypeData(events, proposals) {

    for (const proposalTypeName of Object.keys(this.proposalTypeSwitch)) {
      let proposal_events = events[proposalTypeName]
      proposal_events.forEach(obj => {
        const {event, timestamp} = obj
        const id = event.id.toNumber()
        if (id in proposals) {
          const prop = proposals[id]
          prop.type = this.proposalTypeSwitch[proposalTypeName].type
          proposals[id] = new this.proposalTypeSwitch[proposalTypeName].cls(prop, event)
        }
      })
    }
    return proposals
  }

  processProposalStatusChanges(events, proposals) {
    events["ProposalStateChange"].forEach(obj => {
      const {event, timestamp} = obj
      const id = event.id.toNumber()
      if (id in proposals) {
        proposals[id].status = ProposalState[event.state]
      }
    })
    return proposals
  }

  updateProposalsWithVotes(events, proposals) {
    events["Vote"].forEach(obj => {
      const {event, timestamp} = obj
      const id = event.id.toNumber()
      if(id in proposals) {
        const vote = new Vote(id, event.voter, event.direction, event.votes)
        proposals[id].addVote(vote)
      }
    })
  }


  finalizeProposals(proposals, votingPeriod) {
    const vp = votingPeriod.toNumber()
    for (const id of Array.from(Object.keys(proposals))) {
      if (!("endTimestamp" in proposals[id])) {
        console.log(proposals[id])
        proposals[id].endTimestamp = this.proposals[id].startTimestamp + vp
        proposals[id].info = getIpfsHashFromBytes32(proposals[id].info)
        if (proposals[id].type === ProposalTypes.Thread) {
          proposals[id].descriptor = getIpfsHashFromBytes32(proposals[id].descriptor)
        }
      }

    }
  }


  selectAssetTypeContract(assetId, isThread) {
    const abi = isThread ? ThreadJSON.abi : WEAVRJSON.abi;
    this.contract = new ethers.Contract(assetId, abi, this.provider);
    this.iface = new ethers.utils.Interface(abi);
    this.proposalTypeSwitch = isThread? 
      {
        "TokenActionProposal": {cls: TokenActionProposal, type: ProposalTypes.TokenAction},
        "UpgradeProposal": {cls: UpgradeProposal, type: ProposalTypes.Upgrade},
        // "ParticipantProposal": {cls: ParticipantProposal, type: ProposalTypes.Participant},
        // "ParticipantRemovalProposal": {cls: ParticipantRemovalProposal, type: ProposalTypes.ParticipantRemoval},
        "DescriptorChange": {cls: DescriptorChangeProposal, type: ProposalTypes.descriptorChange}
      } 
    : 
      {
        "TokenActionProposal": {cls: TokenActionProposal, type: ProposalTypes.TokenAction},
        "UpgradeProposal": {cls: UpgradeProposal, type: ProposalTypes.Upgrade},
        "ThreadProposal": {cls: ThreadProposal, type: ProposalTypes.Thread},
        "ParticipantProposal": {cls: ParticipantProposal, type: ProposalTypes.Participant},
        "ParticipantRemovalProposal": {cls: ParticipantRemovalProposal, type: ProposalTypes.ParticipantRemoval},
      }
  }

  /**
   * 
   * @param {bool} asThreads sets the map key with the thread address instead of the needle one
   * @default false returns asset map with crowdfund address as map key
   * @returns Map of the generic asset data, used to complete both needles and threads
   */
  async getAssets(asThreads) {
    const threadDeployer = new ethers.Contract(CONTRACTS.THREAD_DEPLOYER, ThreadDeployerJSON.abi, this.provider)
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
          const td_iface = new ethers.utils.Interface(ThreadDeployerJSON.abi);
          const event = td_iface.decodeEventLog("CrowdfundedThread", rawEvent.data, rawEvent.topics)
          crowdfunds.set(event.crowdfund, {id: event.crowdfund, thread: threads.get(event.thread)})    
        }
      )
    })
    for(let needle of crowdfunds.keys()){
      const crowdfundSC = new ethers.Contract(needle, CrowdfundJSON.abi, this.provider)
      const state = await Marketplace.getNeedleState(crowdfundSC)
      crowdfunds.get(needle).state =CrowdfundState[state]
    }
    assets = Array.from(crowdfunds.values()).map( asset => {
      return {
        id: asThreads ? asset.thread.id : asset.id,
        state: asset.state,
        governor: asset.thread.governor,
        descriptor: asset.thread.descriptor,
        erc20: asset.thread.erc20,
        thread: asset.thread.id,
        crowdfund: asset.id
      }
    })
    this.assets = assets
    return assets
  }

  async fetchNeedles() {
    let crowdfunds = [];
    this.needles = await this.getAssets()
    const threadDeployer = new ethers.Contract(CONTRACTS.THREAD_DEPLOYER, ThreadDeployerJSON.abi, this.provider)
    const crowdfundEvents = (await threadDeployer.queryFilter(threadDeployer.filters.CrowdfundedThread()))
    const NEEDLES = crowdfundEvents.map( async (crf) => {
      const {crowdfund, target, token} = crf.args
      const crowdfundSC = new ethers.Contract(crowdfund, CrowdfundJSON.abi, this.provider)
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
      return res
    })
  }

  async fetchThreads() {
    let threads = [];
    const proposalMap = new Map()
    await this.getAssets(true)
    const onlyFinshed =this.assets.filter( a => a.state == CrowdfundState[3])
    onlyFinshed.map(
      async (thread) => {
        proposalMap.set(thread.id, await this.syncProposals(thread.id))
      }
    )    
    const transfersMap = await this.mapHoldersForAllThreads(onlyFinshed)
    const threadDeployer = new ethers.Contract(CONTRACTS.THREAD_DEPLOYER, ThreadDeployerJSON.abi, this.provider)
    const threadEvents = await threadDeployer.queryFilter(threadDeployer.filters.Thread())

    threadEvents.map( async (trd) => {
      const {thread, governor, descriptor, variant, erc20} = trd.args
      const state = this.assets.find( a => a.id == thread).state
      let _thread = new Thread(
        thread,
        state,  
        governor,
        descriptor,
        variant,
        { id: erc20, holders: transfersMap.get(thread) },
        this.assets.find( a => a.id == thread).crowdfund
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
    const ferc20_contract = new ethers.Contract(erc20, FrabricERC20JSON.abi, this.provider);
    const ferc20_iface = new ethers.utils.Interface(FrabricERC20JSON.abi);
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
        holdersMap.set(holderAddress.toLowerCase(), holder)
      }
    })
    return holdersMap
  }
}





export default InfuraEventCacheClient;