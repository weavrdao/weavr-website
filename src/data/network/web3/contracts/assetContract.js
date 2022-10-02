/* global BigInt */
import { ethers } from "ethers";
import EthereumClient from "../ethereum/ethereumClient";
import { ParticipantType } from "@/models/common";
import { base58 } from "ethers/lib/utils";
const contractArtifact = require("./abi/Frabric.json");
console.log(contractArtifact);
const contractAbi = [
  // Make a buy order
  "function buy(uint256 amount, uint256 price) payable",

  // Create a standard proposal
  "function proposePaper(bool supermajority, bytes32 info) returns (uint256)",

  // Create a participant proposal
  "function proposeParticipant(uint8 participantType, address _participant, bytes32 info) returns (uint256 id)",

  // Create an upgrade proposal
  "function proposeUpgrade(address beacon, address instance, uint256 version, address code, bytes data, bytes32 info) returns (uint256 id)",

  // Create a token action proposal
  "function proposeTokenAction(address token, address target, bool mint, uint256 price, uint256 amount, bytes32 info) returns (uint256 id)",

  // Vote on a proposal
  "function vote(uint256[] ids, int112[] votes)",

  // Propose a thread dissolution
  "function proposeDissolution(string info, address purchaser, address token, uint256 purchaseAmount)",

  // Can Propose
  "function canPropose(address proposer) returns (bool)",

  // Vouch a participant
  "function vouch(address participant, bytes signature)",

  // Propose a new thread
  "function proposeThread(uint8 variant, string name, string symbol, bytes32 descriptor, bytes data, bytes32 info) returns (uint256 id)",

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
    this.contract = ethereumClient.getContract(
      contractAddress,
      contractArtifact.abi
    );
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
    console.log({ participantType, participant, info });
    let tx = await this.mutableContract.proposeParticipant(
      participantType,
      participant,
      info
    );
    await tx.wait();
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
      info,
      {
        gasLimit: 3000000,
      }
    );
    await tx.wait();
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

  async proposeThread(variant, name, symbol, descriptorHash, data, infoHash) {
    console.log("Creating thread proposal...");
    console.dir({
      variant,
      name,
      symbol,
      descriptorHash,
      data,
      infoHash,
    });
    const tx = await this.mutableContract.proposeThread(
      variant,
      name,
      symbol,
      descriptorHash,
      data,
      infoHash
    );

    // const tx = await this.mutableContract.proposeThread(
    //   ethers.BigNumber.from(0),
    //   'THREAD4',
    //   "SYMBL",
    //   "0xb0c16bad9e73e9744fd75e73e344b895e718b61438d0c83ba8727b5442c8160f",
    //   "0x000000000000000000000000d87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c00000000000000000000000000000000000000000000000000000000000003e8",
    //   "0x5a3c1b7907feb4653b1ed39fde329e28db7b958d2e3bf92e48d448c9d1914900",
    //   {
    //     gasLimit: 4000000,
    //   }
    // );
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

    console.log(tx);
    return tx;
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
}

export default AssetContract;
