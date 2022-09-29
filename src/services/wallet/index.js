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
    await this.client.syncWallet(provider)

    let values = await Promise.all([
      await this.client.getWalletAddress(),
      await this.client.getWalletEthBalance()
    ])
    console.log(values);
    const state = new WalletState(
      values[0],
      values[1] / Math.pow(10, 18),
      0,
      "_FRBC",
      0
    )

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