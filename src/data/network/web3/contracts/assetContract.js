/* global BigInt */
const { ethers } = require("ethers")

import EthereumClient from "../ethereum/ethereumClient"
import { ParticipantType } from "@/models/common"
import { base58 } from "ethers/lib/utils"
const contractAbi = [
  // Make a buy order
  "function buy(uint256 amount, uint256 price) payable",

  // Create a standard proposal
  "function proposePaper(bool supermajority, bytes32 info) returns (uint256)",

  // Create a participant proposal
  "function proposeParticipant(uint16 participantType, address _participant, bytes32 info) returns (uint256 id)",
  
  // Vote Yes on a certain proposal
  "function voteYes(uint256 id)",

  // Vote No on a certain proposal
  "function voteNo(uint256 id)",

  // Propose a thread dissolution
  "function proposeDissolution(string info, address purchaser, address token, uint256 purchaseAmount)",

  // Can Propose
  "function canPropose(address proposer) returns (bool)",

  // Event that is triggered every time an order is filled on the market
  "event Filled(address indexed sender, address indexed recipient, uint256 indexed price, uint256 amount)"

]
const startBlock = 0 // TODO: Inject the actual contract deployment block instead

/**
 * Asset contract
 * @param {EthereumClient} ethereumClient Ethereum client
 */
class AssetContract {
  
  

  constructor(
    ethereumClient,
    contractAddress
  ) {
    this.contract = ethereumClient.getContract(contractAddress, contractAbi)
    this.mutableContract = ethereumClient.getMutableContract(this.contract)
  }

  /**
   * Create a standard proposal
   * @param {bytes32} info Proposal info
   */
  async proposePaper(
    supermajority,
    info
  ) {
    console.log(this.mutableContract.address);
    const bytesInfo = ethers.utils.id(info)
    let tx = await this.mutableContract
      .proposePaper(
        supermajority,
        bytesInfo, 
        {
          gasLimit: 500000
        }
      )
    await tx.wait()
  }

  /**
   * Create a participant proposal
   * @param {bytes32} info Proposal info
   */
   async proposeParticipant(
    participantType, 
    participant, 
    info
  ) {
    console.log("Creating a proposal..", info)
    console.log(this.mutableContract.address);
    // const bytesInfo = ethers.utils.id(info)
    
    // console.log("string: ", info, " bytes: ", bytesInfo)
      const hashHex = '1220' + info.slice(2)
      const hashBytes = Buffer.from(hashHex, 'hex')
      const hashStr = base58.encode(hashBytes)
      console.log("info: ", info,  "|| decoded: ", hashStr )
  
  
    let tx = await this.mutableContract
      .proposeParticipant(
        participantType,
        participant,
        info, 
        {
          gasLimit: 50000006
        }
      )
    let status = (await tx.wait()).status
    console.log(status)
  }
  /** 
   * Check if participant can make a proposal 
  */
   async canPropose(proposer){
    let tx = await this.mutableContract
      .canPropose(proposer,
        {
          gasLimit: 5000000
        }
      )
    let status = (await tx.wait()).status
    console.log(status)
   }

  /**
   * Make a buy order
   * @param {number} amount Amount of shares to buy
   * @param {BigInt} price Price to buy at
   */
  async buy(
    amount,
    price
  ) {
    console.log("Amount " + amount)
    console.log("Price " + price)

    let tx = await this.mutableContract
      .buy(
        amount, 
        price,
        {
          value: BigInt(amount) * BigInt(price),
          gasLimit: 5000000
        }
      )

    return (await tx.wait()).status
  }

  /**
   * Vote Yes on a certain proposal
   * @param {string} proposalId ID of the proposal
   */
  async voteYes(
    proposalId
  ) {
    console.log("Voting Yes on the proposal " + proposalId)

    let tx = await this.mutableContract
      .voteYes(
        proposalId, 
        {
          gasLimit: 5000000
        }
      )

    return (await tx.wait()).status
  }

  /**
   * Vote No on a certain proposal
   * @param {string} proposalId ID of the proposal
   */
  async voteNo(
    proposalId
  ) {
    console.log("Voting No on the proposal " + proposalId)

    let tx = await this.mutableContract
      .voteNo(
        proposalId, 
        {
          gasLimit: 5000000
        }
      )

    return (await tx.wait()).status
  }

  /**
   * Propose a thread dissolution
   * @param {string} info Proposal info
   * @param {address} purchaser Dissolution proposer
   * @param {address} token Currency provided for payment
   * @param {uint256} purchaseAmount Amount proposed for the purchase
   */
  async proposeDissolution(
    info, 
    purchaser, 
    token, 
    purchaseAmount
  ) {
    console.log("Dissolution proposal for " + token, + " by " + purchaser + "for $" + purchaseAmount)

    let tx = await this.mutableContract
      .proposeDissolution(
        info, 
        purchaser, 
        token, 
        purchaseAmount,
        {
          gasLimit: 5000000
        }
      )
      
    return (await tx.wait()).status
  }
}

export default AssetContract
