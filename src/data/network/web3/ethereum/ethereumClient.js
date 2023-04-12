/* eslint-disable no-invalid-this */
/* eslint-disable max-lines-per-function */
import { createToaster } from "@meforma/vue-toaster";
const {
  getCoinbaseWalletProvider,
  getMetaMaskProvider,
} = require("./providers");
import { CoinbaseConnector } from "./walletProviders/CoinbaseConnector.js";
import { MetaMaskConnector } from "./walletProviders/MetaMaskConnector";
import { toHex } from "@/utils/common.js";
import {NETWORK} from "../../../../services/constants"
require("dotenv").config();
const { ethers } = require("ethers");

/**
 * @property {ethers.JsonRpcSigner} walletProvider
 * @property {ethers.JsonRpcSigner} walletSigner
 */
class EthereumClient {
  _connector = 0;
  
  constructor() {}

  /* --- Blockchain state --- */

  /**
   * Get current block number.
   */
  async getBlockNumber() {
    return (await this.readProvider.getBlockNumber());
  }

  changeAccount = new Event("accountChange", this.walletProvider?.on("accountsChanged", async (account) => {
    console.log("AccountsChanged ", account)
  }))

  /* --- Wallet access --- */
  async syncWallet(wallet) {
    // Using in-browser wallet to access wallet state and sign transactions
    if (wallet == "metamask") {
      try {
        const metamask = getMetaMaskProvider();
        if(metamask.chainId !== ethers.utils.hexValue(NETWORK.id)) {
          const toast = createToaster({});
          toast.error(`Please connect to ${NETWORK.name} Network`, {
            position: "top",
          });
          return false
        }
        
        this.walletProvider = metamask;
        this._connector = new MetaMaskConnector(metamask);
        this.account = await this._connector.getAddress();
        await this._connector.getChainId()
        metamask.on("accountsChanged", () => {
          window.location.reload()
        })
        metamask.on("chainChanged", () => { 
          window.location.reload()
        })
        console.log("CHAIN_ID___", this._connector.chainId)
        this.walletSigner = await this._connector.getSigner(
          this._connector.chainId
        );
        return true;
      } catch (error) {
        console.log(error);
        const toast = createToaster({});
        toast.error("Something went wrong connecting to Metamask", {
          position: "top",
        });
        return false;
      }
    }
    if (wallet == "coinbase") {
      try {
        const coinbase = getCoinbaseWalletProvider();
        this.walletProvider = coinbase;
        this._connector = new CoinbaseConnector(coinbase);
        this.account = await this._connector.getAddress();
        this.walletSigner = await this._connector.getSigner(
          await this._connector.getChainId()
        );
        return;
      } catch (error) {
        console.log(error);
        const toast = createToaster({});
        toast.error("Something went wrong connecting to Coinbase", {
          position: "top",
        });
        return;
      }
    }
  }
  


  getChainId() {
    return this._connector.chainId
  }

  switchNetwork = async () => {
    try {
      await this.walletProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(this.chainId || NETWORK.id) }],
      });
    } catch (error) {
      this.error = error;
    }
  };

  async getWalletAddress() {
    return await this._connector.getAddress();
  }
  async getWalletEthBalance() {
    return (await this._connector.getEthBalance());
  }

  /**
   * @ToDo Implement coinbase Signature
   */
  async getSignature(params) {    
    console.log(params);
    const fromAddress = await this.getWalletAddress();
    return await this._connector.provider.request({
      method: "eth_signTypedData_v4",
      params: [fromAddress, JSON.stringify(params)]
    }).then( (sig) => {
      console.log("SIGNATURE: ", sig);
      return sig
    })
  }

  /* --- Contract access --- */

  /**
   * Initialize contract.
   * @param {string} address Contract address
   * @param {string} abi Contract ABI
   * @returns Read-only contract instance
   */
  getContract(address, abi) {
    return new ethers.Contract(
      address,
      abi,
      this.walletSigner || this.walletProvider
    );
  }

  /**
   * Get a copy of the contract where signable transactions can be executed.
   * @param {ethers.Contract} contract Contract
   * @returns {ethers.Contract} Contract instance with signer (wallet) connected to it
   */
  getMutableContract(contract) {
    return contract.connect(this.walletSigner);
  }
}

export default EthereumClient;
