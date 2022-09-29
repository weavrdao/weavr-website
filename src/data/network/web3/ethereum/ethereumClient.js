import { createToaster } from "@meforma/vue-toaster";
const {  getCoinbaseWalletProvider, getMetaMaskProvider,  DEFAULT_CHAIN_ID} = require("./providers")
import {CoinbaseConnector} from "./walletProviders/CoinbaseConnector.js"
import {toHex} from "@/utils/common.js"
require("dotenv").config();
const { ethers } = require("ethers");
const { CoinbaseWalletSDK } = require("@coinbase/wallet-sdk");
/**
 * @property {ethers.JsonRpcSigner} walletProvider
 * @property {ethers.JsonRpcSigner} walletSigner
 */
/**
 * @NOTE Need to implent whatchers for chianID, chain-changes and switchToNetwork  
 */


class EthereumClient {
  constructor() { }

  /* --- Blockchain state --- */

  /**
   * Get current block number.
   */
  async getBlockNumber() {
    const number = await this.readProvider.getBlockNumber()
  }

  /* --- Wallet access --- */

  async syncWallet(wallet) {
    // Using in-browser wallet to access wallet state and sign transactions
    if(wallet == "metamask") {
      try{
        
        const metamask = window.ethereum?.providers ? getMetaMaskProvider() : window.ethereum
        this.walletProvider = new ethers.providers.Web3Provider(metamask)
        this.walletSigner = this.walletProvider.getSigner()
      
      } 
      catch(error) {
        
        console.log(error)
        const toast = createToaster({});
        toast.error("Something went wrong connecting to Metamask", {
          position: "top"
        })
        return
      
      }
    }
    if(wallet == "coinbase") {
      try {
        
        const coinbase = getCoinbaseWalletProvider()
        this.walletProvider = coinbase
        const connector =  new CoinbaseConnector(coinbase)
        this.account = await connector.getAddress()
        this.walletSigner = await connector.getSigner(await connector.getChainId());
        return   
      
      } catch (error) {
      
        console.log(error)
        const toast = createToaster({});
        toast.error("Something went wrong connecting to Coinbase", {
          position: "top"
        })
        return
      
      }  
    } 
  }

  switchNetwork = async  (network) => {
    try {
      await this.walletProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(this.chainId || DEFAULT_CHAIN_ID) }],
      });
    } catch (error) {
      this.error = error;
    }
  }
  
  async getWalletAddress() {
      return await this.walletSigner.getAddress()
  }
  async getWalletEthBalance() {
    return (await this.walletSigner.getBalance()).toString()
  }

  /**
   * @ToDo Implement coinbase Signature
   */
  async getSignature(domain, types, data) {
    return await this.walletSigner._signTypedData(domain, types, data)
  }
  

  /* --- Contract access --- */

  /**
   * Initialize contract.
   * @param {string} address Contract address
   * @param {string} abi Contract ABI
   * @returns Read-only contract instance
   */
  getContract(address, abi) {
    return new ethers.Contract(address, abi, this.walletSigner || this.walletProvider)
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