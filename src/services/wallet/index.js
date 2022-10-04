import EthereumClient from "../../data/network/web3/ethereum/ethereumClient"
import WalletState from "../../models/walletState"

/**
 * Wallet service
 * @property {EthereumClient} client Ethereum client
 */
class Wallet {
  constructor(
    ethereumClient
  ) {
    this.client = ethereumClient
  }

  async getState(provider) {
    console.log("WALLET_PROVIDER: ", provider)
    
    Promise.all([await this.client.syncWallet(provider)])
    // const address = await this.client.getWalletAddress()
    // const balance = await this.client.getWalletEthBalance()
    // let values = await Promise.all([
    //   address, 
    //   balance
    // ])
    // console.log(values);
    const state = new WalletState(
      "sadsa",
      "sadsadsad",
      0,
      "_FRBC",
      0
    )
    console.log("end of wallet");
    return state
  }

  async walletConnect(provider) {
    if(provider){
      const val = await this.client.connectWallet(provider)
      return new WalletState ({
        address: val.account
      })
    }
  }
  async getSignature (domain, types, data) {
    const signature = await this.client.getSignature(domain, types, data);
    const sig = Promise.all([signature]);
    return sig;
    
  }
}

export default Wallet