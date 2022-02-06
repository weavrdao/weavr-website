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

  async getState() {
    await this.client.syncWallet()

    let values = await Promise.all([
      (await this.client.getWalletAddress()).toLowerCase(),
      this.client.getWalletEthBalance()
    ])

    const state = new WalletState(
      values[0],
      values[1] / Math.pow(10, 18)
    )

    return state
  }
}

export default Wallet