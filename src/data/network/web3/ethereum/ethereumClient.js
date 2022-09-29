import { createToaster } from "@meforma/vue-toaster";
const {  getCoinbaseWalletProvider, getMetaMaskProvider} = require("./providers")
require("dotenv").config();
const { ethers } = require("ethers");
const { CoinbaseWalletSDK } = require("@coinbase/wallet-sdk");
/**
 * @property {ethers.JsonRpcSigner} walletProvider
 * @property {ethers.JsonRpcSigner} walletSigner
 */

class customSigner extends ethers.Signer {
  
}

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

  async syncWallet(wallet) {
    // if (this.walletProvider != null && this.walletSigner != null) { return }
    console.log(wallet)
    // Using in-browser wallet to access wallet state and sign transactions
    if(wallet == "metamask") {
      console.log("METAMASK OK")
      try{
        console.log(window.ethereum);
        console.log(window.ethereum?.providers);
        const metamask =  window.ethereum
        console.log(metamask);
        this.walletProvider = new ethers.providers.Web3Provider(metamask)
        this.walletSigner = this.walletProvider.getSigner()
        console.log("WalletSigner: ", this.walletSigner);
      } catch(error) {
        console.log(error)
        const toast = createToaster({});
        toast.error("Something went wrong connecting to Metamask", {
          position: "top"
        })
        return
      }
    }
    if(wallet == "coinbase") {  
      console.log("COINBASAE");
      const coinbase = getCoinbaseWalletProvider()
      console.log(coinbase);
      this.walletProvider = coinbase
      
      console.log(this.walletProvider);
      this.account = await this.getWalletAddress()
      return 
    } 
  }



  async connectWallet(provider) {
    console.log();
    if(provider.provider){
      this.provider=provider.provider
    }
    try {
      // Get accounts for connected wallet
      
      const accounts = await this.provider.request({
        method: "eth_requestAccounts",
      });
      if (accounts) {
        console.log(accounts)
        this.account = accounts[0];
      }
      // Get current chain ID for connected wallet
      const chainId = await this.provider.request({
        method: "eth_chainId",
      });
      this.chainId = Number(chainId);
      console.log(this.chainId, this.account)
      this.walletProvider = new ethers.providers.Web3Provider(this.provider)
      this.walletSigner = this.walletProvider.getSigner()
      this.walletSigner.connect(this.provider)
      console.log(this.walletSigner);
      return {
        account: this.account,
        chainId: this.chainId
      }
    } catch (error) {
      this.error = error;
    }
  
  }


  async getWalletAddress() {
    let coinbase = false
    if(coinbase){
      this.getCoinbaseEthereumAddress()      
    }else {

      return this.walletSigner.getAddress()
    }
     
  }

  getCoinbaseEthereumAddress() {
    return this.walletProvider.request({ method: 'eth_requestAccounts' }).then(response => {
      const accounts = response
      console.log(`User's address is ${accounts[0]}`)
      this.account = accounts[0]
      return accounts[0]  
    })
  }

  async getWalletEthBalance() {
    let coinbase = false
    if(coinbase){
   
      const account = await this.getCoinbaseEthereumAddress()
      console.log(account);
      this.walletProvider.request({ method: 'eth_getBalance', params: [ this.account || account, "latest"] }).then(response => {
        const accounts = response
        console.log(`User's bal is ${accounts}`)
        return response
      })
      
    }else {
    return (await this.walletSigner.getBalance()).toString()
    }
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