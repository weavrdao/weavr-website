import Thread from "@/models/marketplace/thread"
import {CONTRACTS} from "@/services/constants"
import {ProposalState} from "@/models/common"
let THREADS = []

// export const fetchThreads = async (provider) => {
//     const threadDeployer = new ethers.Contract(CONTRACTS.THREAD_DEPLOYER, ThreadDeployer.abi, provider)
//     const crowdfundEvents = (await threadDeployer.queryFilter(threadDeployer.filters.CrowdfundedThread()))
// }

export const fetchNeedles = async (provider) => {
    const threadDeployer = new ethers.Contract(CONTRACTS.THREAD_DEPLOYER, ThreadDeployer.abi, provider)
    const crowdfundEvents = (await threadDeployer.queryFilter(threadDeployer.filters.CrowdfundedThread()))
    const crfMap = []
    console.log("CROWDFUNDED NEEDLES:::::", crowdfundEvents);
    crowdfundEvents.forEach( async (crf) => {
      const {crowdfund, target, thread, token} = crf.args
      
      const crowdfundSC = new ethers.Contract(crowdfund, Crowdfund.abi, this.provider)
      const stateEvent = await crowdfundSC.queryFilter(crowdfundSC.filters.StateChange())
      const state = stateEvent[stateEvent.length-1].args['state']
      const depositEvent = await crowdfundSC.queryFilter(crowdfundSC.filters.Deposit())
      console.log(depositEvent);
      const deposits = depositEvent.map( dep => {
        
         new Map(dep.args['depositor'], dep.args['amount'])
      })
      console.log("STATE => ", ProposalState[0]);
      const needle = new Needle(
        crowdfund,
        state,  
        0,
        target,
        thread,
        deposits,
        [],
        []
      )
      crfMap.push(needle)
    })
    console.log(crfMap);
    return crfMap
  }