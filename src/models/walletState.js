/**
 * Wallet state model.
 * @property {string} address Address of the wallet
 * @property {number} ethBalance Balance of the wallet in ETH
 * @property {number} tokenBalance Balance of FBRC tokens in user's wallet
 */
class WalletState {
  constructor(
    address,
    ethBalance,
    tokenBalance = 0,
    tradeTokenBalance = 0,
  ) {
    this.address = address;
    this.ethBalance = ethBalance;
    this.tokenBalance = tokenBalance;
    this.tradeTokenBalance = tradeTokenBalance;
  }
}

export default WalletState