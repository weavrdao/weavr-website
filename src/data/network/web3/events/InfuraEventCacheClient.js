import {ethers } from "ethers";
import {CONTRACTS} from "@/services/constants"
import {getIpfsHashFromBytes32} from "@/data/network/storage/ipfs/common";
import {Needle, Thread, ERC20_TX, Holder} from "@/models/Assets"
import {Marketplace} from "./marketplace/marketplace"
import {Vote} from "@/models/vote";
import {ProposalState, ProposalTypes, CrowdfundState} from "@/models/common";
import {CrowdfundJSON, ThreadDeployerJSON,  FrabricERC20JSON, WEAVRJSON, ThreadJSON} from "../contracts/abi"
import {
  BaseProposal, 
  TokenActionProposal, 
  ParticipantProposal, 
  ParticipantRemovalProposal, 
  ThreadProposal, 
  UpgradeProposal,
  DescriptorChangeProposal
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
      
    await this.getProposals(assetId, isThread, blockNumber, currentBlockNumber)
    await this.processProposalTypeData(blockNumber, currentBlockNumber)
    await this.updateProposalsWithVotes( blockNumber, currentBlockNumber)
    await this.processProposalStatusChanges(blockNumber, currentBlockNumber)
    await this.finalizeProposals()
      
    return Array.from(this.proposals.values())
  }

  async getProposals(assetId, isThread, blockNumber, currentBlockNumber) {
    this.selectAssetTypeContract(assetId, isThread)
    await this.contract.queryFilter("Proposal",blockNumber, currentBlockNumber).then(async (raw_events) => {
      for (const raw_event of raw_events) {
        const event = this.iface.decodeEventLog("Proposal", raw_event.data, raw_event.topics)
        const block = await this.provider.getBlock(raw_event.blockNumber)
        const proposal = new BaseProposal(event.id.toNumber(), event.creator, event.info, event.supermajority, block.timestamp)
        this.proposals.set(proposal.id, proposal)
      }
      // Filter out only the events that are important to you
    })
  }

  async finalizeProposals() {
    const votingPeriod = await this.contract.votingPeriod()
    const vp = votingPeriod.toNumber()
    for (const id of Array.from(this.proposals.keys())) {
      if (!("endTimestamp" in this.proposals.get(id))) {
        this.proposals.get(id).endTimestamp = this.proposals.get(id).startTimestamp + vp
        this.proposals.get(id).info = getIpfsHashFromBytes32(this.proposals.get(id).info)
        if (this.proposals.get(id).type === ProposalTypes.Thread) {
          this.proposals.get(id).descriptor = getIpfsHashFromBytes32(this.proposals.get(id).descriptor)
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

  async processProposalTypeData(syncBlockNumber, currentBlockNumber) {
    
    for (const proposalTypeName of Object.keys(this.proposalTypeSwitch)) {
      await this.contract.queryFilter(proposalTypeName, syncBlockNumber, currentBlockNumber).then(async (raw_events) => {
        for (const raw_event of raw_events) {
          const event = this.iface.decodeEventLog(proposalTypeName, raw_event.data, raw_event.topics)
          if (event.id in this.proposals) {
            const prop = this.proposals[event.id]
            prop.type = this.proposalTypeSwitch[proposalTypeName].type
            this.proposals.set(event.id, new this.proposalTypeSwitch[proposalTypeName].cls(prop, event))
            
          }
        }
      })
    }
    
  }

  async processProposalStatusChanges(syncBlockNumber, currentBlockNumber) {
    await this.contract.queryFilter("ProposalStateChange", syncBlockNumber, currentBlockNumber).then(async (raw_events) => {
      for (const raw_event of raw_events) {
        const event = this.iface.decodeEventLog("ProposalStateChange", raw_event.data, raw_event.topics)
        if (event.id.toNumber() in Array.from(this.proposals.keys())) {
          this.proposals.get(event.id.toNumber()).status = ProposalState[event.state]
        } else {
          throw new Error(`Got ProposalStateChange for proposal ${event.id} but no proposal exists with that id`);
        }
      }
      // Filter out only the events that are important to you
    })
  }

  async updateProposalsWithVotes(syncBlockNumber, currentBlockNumber) {
    await this.contract.queryFilter("Vote", syncBlockNumber, currentBlockNumber).then(async (events) => {
      for (const event_data of events) {
        const event = this.iface.decodeEventLog("Vote", event_data.data, event_data.topics)
        if (event.id.toNumber() in Array.from(this.proposals.keys())) {
          const vote = new Vote(event.id, event.voter, event.direction, event.votes)
          const id = event.id.toNumber()
          this.proposals.get(id).addVote(vote)
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