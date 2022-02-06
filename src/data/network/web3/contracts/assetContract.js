/* global BigInt */
const { ethers } = require("ethers")

import EthereumClient from "../ethereum/ethereumClient"

const contractAbi = [
  // Make a buy order
  "function buy(uint256 amount, uint256 price) payable",

  // Create a standard proposal
  "function proposePaper(string info) returns (uint256)",

  // Vote Yes on a certain proposal
  "function voteYes(uint256 id)",

  // Vote No on a certain proposal
  "function voteNo(uint256 id)",

  // Propose a thread dissolution
  "function proposeDissolution(string info, address purchaser, address token, uint256 purchaseAmount)",

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
   * @param {string} info Proposal info
   */
  async proposePaper(
    info
  ) {
    console.log("Creating a proposal..")

    let tx = await this.mutableContract
      .proposePaper(
        info, 
        {
          gasLimit: 5000000
        }
      )

    return (await tx.wait()).status
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
