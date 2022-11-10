/* global BigInt */
import EthereumClient from "../ethereum/ethereumClient";
import contractAbi from "./abi/USDC";
import { ethers } from "ethers";

/**
 * Frabric ERC20 contract
 * @param {EthereumClient} ethereumClient Ethereum client
 */
class USDCContract {
  constructor(ethereumClient, contractAddress) {
    this.contract = ethereumClient.getContract(contractAddress, contractAbi);
    this.mutableContract = ethereumClient.getMutableContract(this.contract);
  }

  // General token functions

  /**
   * Query token balance of an account
   * @param {string} account Address of account to query
   */
  async balanceOf(account) {
    try {
      return await this.contract.balanceOf(account);
    } catch (e) {
      console.log(e);
    }
  }

  // Query decimals of token
  async decimals() {
    try {
      return await this.contract.decimals();
    } catch (e) {
      console.log(e);
    }
  }

  async allowance(owner, spender) {
    try {
      return await this.contract.allowance(owner, spender);
    } catch(e) {
      console.error(e);
    }
  }

  async approve(spender) {
    try {
      const totalSupply = await this.contract.totalSupply();
      const tx = await this.mutableContract.approve(spender, totalSupply);
      return (await tx.wait()).status;
    } catch(e) {
      console.error(e);
    }
  }
}

export default USDCContract;
