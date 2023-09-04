/* global BigInt */
import { ethers } from "ethers";

const contractAbi = [
  // Make a buy order
  "function buy(uint256 amount, uint256 price) payable",

  // Create a standard proposal
  "function proposePaper(bool supermajority, bytes32 info) returns (uint256)",

  // Create a participant proposal
  "function proposeParticipant(uint8 participantType, address _participant, bytes32 info) returns (uint256 id)",

  // Create a participant removal proposal
  "function proposeParticipantRemoval(address participant, uint8 removalFee, bytes[] calldata signatures, bytes32 info) returns (uint256 id)",

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

  // Propose Descriptor Change
  "function proposeDescriptorChange(bytes32 _descriptor, bytes32 info) returns (uint256 id)",

  // Can Propose
  "function canPropose(address proposer) returns (bool)",

  // Withdraw proposal
  "function withdrawProposal(uint256 id)",

  // Queue proposal
  "function queueProposal(uint256 id)",

  // Complete proposal
  "function completeProposal(uint256 id, bytes data)",

  // Vouch a participant
  "function vouch(address participant, bytes signature)",

  // Approve (KYC) a participant
  "function approve( uint8 pType, address approving,  bytes32 kycHash, bytes signature)",

  // Propose a new thread
  "function proposeThread(uint8 variant, string name, string symbol, bytes32 descriptor, bytes data, bytes32 info) returns (uint256 id)",

  "function requiredParticipation() view returns (uint112)",

  // Event that is triggered every time an order is filled on the market
  "event Filled(address indexed sender, address indexed recipient, uint256 indexed price, uint256 amount)",
];

/**
 * Asset contract
 * @param {EthereumClient} ethereumClient Ethereum client
 */
class AssetContract {
  constructor(ethereumClient, contractAddress) {
    this.contract = ethereumClient.getContract(
      contractAddress,
      contractAbi
    );
    this.mutableContract = ethereumClient.getMutableContract(this.contract);
  }

  /**
   * Create a standard proposal
   * @param {bytes32} info Proposal info
   */
  async proposePaper(supermajority, info) {
    console.log(`SENT DIRECTLY TO CONTRACT: ${info} :: => ${this.mutableContract.address}`);

    let tx = await this.mutableContract.proposePaper(supermajority, info,
    );
    return (await tx.wait()).status;
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
      info,
      {
        gasLimit: 5000000,
      }
    );
    return (await tx.wait()).status;
  }

  async proposeParticipantRemoval(participant, removalFee, signatures, info) {
    console.log("Creating participant removal proposal...");
    console.log({
      participant,
      removalFee,
      signatures,
      info,
    });
    const tx = await this.mutableContract.proposeParticipantRemoval(
      participant,
      removalFee,
      signatures,
      info,
      {
        gasLimit: 5000000,
      }
    );
    return (await tx.wait()).status;
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
        gasLimit: 5000000,
      }
    );
    return (await tx.wait()).status;
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
      info,
      {
        gasLimit: 5000000,
      }
    );
    return (await tx.wait()).status;
  }

  async proposeDescriptorChange(descriptor, info) {
    let tx = await this.mutableContract.proposeDescriptorChange(descriptor, info,
      {
        gasLimit: 5000000,
      });
    return (await tx.wait()).status;
  }

  async proposeThread(variant, name, symbol, descriptorHash, data, infoHash) {
    console.log("Creating thread proposal...");
    console.log({
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
      infoHash,
      {
        gasLimit: 5000000
      }
    );
    return (await tx.wait()).status;
  }

  /**
   * Vouch a participant
   */
  async vouch(participant, signature) {

    // const bytesSignature = ethers.utils.id(signature);
    console.log("ASSETCONTRACT: ", signature);
    let tx = this.mutableContract.vouch(participant, signature, { gasLimit: 5000000 });
    // this.mutableContract.signer

    console.log(tx);
    return tx;
  }

  /**
   * Queue a proposal
   */
  async queueProposal(proposalId) {

    console.log("ASSETCONTRACT: ", proposalId);
    let tx = await this.mutableContract.queueProposal(proposalId, { gasLimit: 5000000 });

    console.log(tx);
    return tx;
  }

  /**
   * Complete a proposal
   */
  async completeProposal(proposalId, data) {

    console.log("ASSETCONTRACT: ", proposalId);
    let tx = await this.mutableContract.completeProposal(proposalId, data, { gasLimit: 5000000 });

    console.log(tx);
    return tx;
  }

  /**
   * Approve a KYC vendor verified participant
   */
  async approve(
    pType,
    approving,
    kycHash,
    signature
  ) {
    console.log({ pType, approving, kycHash, signature })
    const tx = await this.mutableContract.approve(pType, approving, kycHash, signature, {
      gasLimit: 5000000,
    });
    return (await tx.wait()).status;
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
      [ethers.utils.parseEther(votes.toString())],
      { "gasLimit": 5000000 }
    );

    return (await tx.wait()).status;
  }

  async withdrawProposal(proposalId) {
    const tx = await this.mutableContract.withdrawProposal(proposalId, { "gasLimit": 5000000 });
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

  async requiredParticipation() {
    const quorum = await this.mutableContract.requiredParticipation();
    console.log(quorum);
    return quorum;
  }

  async erc20() {
    const address = await this.contract.erc20();
    return address;
  }
}

export default AssetContract;
