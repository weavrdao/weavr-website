/**
 * Wallet state model.
 * @property {string} address Address of the wallet
 * @property {number} ethBalance Balance of the wallet in ETH
 */
 class WalletState {
  constructor(
    address,
    ethBalance
  ) {
    this.address = address
    this.ethBalance = ethBalance
  }
}

export default WalletState