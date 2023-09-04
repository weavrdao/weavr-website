import {Deposit, Distribution} from "../../../../../models/Assets"
import {ethers } from "ethers";

const getNeedleDestribuition = async (crowdfundSC) => {
  const distributionEvents = await crowdfundSC.queryFilter(crowdfundSC.filters.Distribution())
  return new Promise((res) => {
    
    const distributions = distributionEvents.map( dis => {
      return new Distribution(dis.args.id, dis.args.token, dis.args.amount)
    })
    res(distributions)
  }) 
}
const getNeedleDeposits = async (crowdfundSC) => {
  const depositEvent = await crowdfundSC.queryFilter(crowdfundSC.filters.Deposit())
  return new Promise((res) => {
    let deposited = ethers.BigNumber.from("0")
    const deposits = depositEvent.map( dep => {
      const id = `${dep.args.depositor}_${dep.args.amount}`
      deposited = deposited.add(dep.args.amount)
      return new Deposit(id, dep.args.depositor, dep.args.amount)
    })
    res({deposits, deposited})
  }) 
}
const getNeedleWithdrawals = async(crowdfundSC) => {
  const withdrawalEvent = await crowdfundSC.queryFilter(crowdfundSC.filters.Withdraw())
  return new Promise((res) => {
    let withdrew = ethers.BigNumber.from("0")
    let withdawals = []
    withdrawalEvent.map( w => {
      const id = `${w.args.depositor}_${w.args.amount}`
      withdrew = withdrew.add(w.args.amount)
      withdawals.push(new Deposit(id, w.args.depositor, w.args.amount))
    })
    res({withdawals, withdrew})
  }) 
}
const getNeedleState = async (crowdfundSC) => {
  const stateEvents = crowdfundSC.queryFilter(crowdfundSC.filters.StateChange())
  return new Promise((res) => {
    stateEvents.then(
      response => {
        res(response[response.length -1 ].args.state)
      }
    )
  })
}

export const Marketplace = { getNeedleDeposits, getNeedleDestribuition, getNeedleWithdrawals ,getNeedleState}