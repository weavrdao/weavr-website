/* global BigInt */
import { ethers } from "ethers";
import EthereumClient from "../ethereum/ethereumClient";
import { ParticipantType } from "@/models/common";
import { base58 } from "ethers/lib/utils";
const contractAbi = [
  // Make a buy order
  "function buy(uint256 amount, uint256 price) payable",

  // Create a standard proposal
  "function proposePaper(bool supermajority, bytes32 info) returns (uint256)",

  // Create a participant proposal
  "function proposeParticipant(uint16 participantType, address _participant, bytes32 info) returns (uint256 id)",

  // Create an upgrade proposal
  "function proposeUpgrade(address beacon, address instance, uint256 version, address code, bytes data, bytes32 info) returns (uint256 id)",

  // Create a token action proposal
  "function proposeTokenAction(address token, address target, bool mint, uint256 price, uint256 amount, bytes32 info) returns (uint256 id)",

  // Vote on a proposal
  "function vote(uint256[] ids, int112[] votes)",

  // Get ERC20 address of asset
  "function erc20() view returns (address)",

  // Propose a thread dissolution
  "function proposeDissolution(string info, address purchaser, address token, uint256 purchaseAmount)",

  // Can Propose
  "function canPropose(address proposer) returns (bool)",

  // Vouch a participant
  "function vouch(address participant, bytes signature)",

  // Event that is triggered every time an order is filled on the market
  "event Filled(address indexed sender, address indexed recipient, uint256 indexed price, uint256 amount)",
];
const startBlock = 0; // TODO: Inject the actual contract deployment block instead

/**
 * Asset contract
 * @param {EthereumClient} ethereumClient Ethereum client
 */
class AssetContract {
  constructor(ethereumClient, contractAddress) {
    this.contract = ethereumClient.getContract(contractAddress, contractAbi);
    this.mutableContract = ethereumClient.getMutableContract(this.contract);
  }

  /**
   * Create a standard proposal
   * @param {bytes32} info Proposal info
   */
  async proposePaper(supermajority, info) {
    console.log(`SENT DIRECTLY TO CONTRACT: ${info}`);
    let tx = await this.mutableContract.proposePaper(supermajority, info);
    await tx.wait();
  }

  /**
   * Create a participant proposal
   * @param {bytes32} info Proposal info
   */
  async proposeParticipant(participantType, participant, info) {
    let tx = await this.mutableContract.proposeParticipant(
      participantType,
      participant,
      info
    );
    let status = (await tx.wait()).status;
    console.log(status);
  }

  // eslint-disable-next-line class-methods-use-this
  async proposeUpgrade(beacon, instance, version, code, data, info) {
    console.log("Creating upgrade proposal...");
    const tx = await this.mutableContract.proposeUpgrade(
      beacon,
      instance,
      version,
      code,
      data,
      info
    );
    const status = (await tx.wait()).status;
    console.log(status);
    return status;
  }

  async proposeTokenAction(token, target, mint, price, amount, info) {
    console.log("Creating token action proposal...");
    console.log({
      token,
      target,
      mint,
      price,
      amount,
      info,
    });
    const tx = await this.mutableContract.proposeTokenAction(
      token,
      target,
      mint,
      price,
      amount,
      info
    );
    const status = (await tx.wait()).status;
    return status;
  }

  /**
   * Vouch a participant
   */
  async vouch(participant, signature) {
    // const bytesSignature = ethers.utils.id(signature);
    console.log("ASSETCONTRACT: ", participant, signature);
    let tx = this.mutableContract.vouch(participant, signature, {
      gasLimit: 5000000,
    });
    // this.mutableContract.signer
    let status = (await tx.wait()).status;
    console.log(status);
    return status;
  }

  /**
   * Check if participant can make a proposal
   */
  async canPropose(proposer) {
    let tx = await this.mutableContract.canPropose(proposer, {
      gasLimit: 5000000,
    });
    let status = (await tx.wait()).status;
    console.log(status);
  }

  /**
   * Make a buy order
   * @param {number} amount Amount of shares to buy
   * @param {BigInt} price Price to buy at
   */
  async buy(amount, price) {
    console.log("Amount " + amount);
    console.log("Price " + price);

    let tx = await this.mutableContract.buy(amount, price, {
      value: BigInt(amount) * BigInt(price),
      gasLimit: 5000000,
    });

    return (await tx.wait()).status;
  }

  /**
   * Vote on a proposal
   * @param {string} proposalId ID of the proposal
   * @param {string} votes Number of votes to cast (sign handles for or against)
   */
  async vote(proposalId, votes) {
    console.dir({
      votesRaw: votes,
      votesType: typeof votes,
      parsed: ethers.utils.parseEther(votes.toString()),
    });
    let tx = await this.mutableContract.vote(
      [proposalId],
      [ethers.utils.parseEther(votes.toString())]
    );

    return (await tx.wait()).status;
  }

  /**
   * Propose a thread dissolution
   * @param {string} info Proposal info
   * @param {address} purchaser Dissolution proposer
   * @param {address} token Currency provided for payment
   * @param {uint256} purchaseAmount Amount proposed for the purchase
   */
  async proposeDissolution(info, purchaser, token, purchaseAmount) {
    console.log(
      "Dissolution proposal for " + token,
      +" by " + purchaser + "for $" + purchaseAmount
    );

    let tx = await this.mutableContract.proposeDissolution(
      info,
      purchaser,
      token,
      purchaseAmount,
      {
        gasLimit: 5000000,
      }
    );

    return (await tx.wait()).status;
  }

  async erc20() {
    const address = await this.contract.erc20();
    return address;
  }
}

export default AssetContract;
