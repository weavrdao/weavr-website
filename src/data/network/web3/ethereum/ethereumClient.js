require("dotenv").config()
const { ethers } = require("ethers")

/**
 * @property {ethers.JsonRpcSigner} walletProvider
 * @property {ethers.JsonRpcSigner} walletSigner
 */
class EthereumClient {
  constructor() { }

  /* --- Blockchain state --- */

  /**
   * Get current block number.
   */
  async getBlockNumber() {
    const number = await this.readProvider.getBlockNumber()
    console.log(number)
  }

  /* --- Wallet access --- */

  async syncWallet() {
    if (this.walletProvider != null && this.walletSigner != null) { return }

    // Using in-browser wallet to access wallet state and sign transactions
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch(error) {
        console.log(error)
        return
      }
    }

    this.walletProvider = new ethers.providers.Web3Provider(window.ethereum)
    this.walletSigner = this.walletProvider.getSigner()

    return true
  }

  async getWalletAddress() {
    return this.walletSigner.getAddress()
  }

  async getWalletEthBalance() {
    return (await this.walletSigner.getBalance()).toString()
  }

  /* --- Contract access --- */

  /**
   * Initialize contract.
   * @param {string} address Contract address
   * @param {string} abi Contract ABI
   * @returns Read-only contract instance
   */
  getContract(address, abi) {
    return new ethers.Contract(address, abi, this.walletSigner)
  }

  /**
   * Get a copy of the contract where signable transactions can be executed.
   * @param {ethers.Contract} contract Contract
   * @returns {ethers.Contract} Contract instance with signer (wallet) connected to it
   */
  getMutableContract(contract) {
    return contract.connect(this.walletSigner)
  } 
}

export default EthereumClient