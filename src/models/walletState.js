/**
 * Wallet state model.
 * @property {string} address Address of the wallet
 * @property {number} ethBalance Balance of the wallet in ETH
 */

const networks = {
  mainnet: "1",
  kovan: "42",
  ropsten: "3",
  rinkeby: "4",
  goerli: "5",
  arbitrum: "42161",
};

class WalletState {
  constructor(
    address,
    ethBalance,
    tokenBalance,
    tokenSymbol,
    vouches,
    network
  ) {
    this.address = address;
    this.ethBalance = ethBalance;
    this.tokenBalance = tokenBalance;
    this.tokenSymbol = tokenSymbol;
    this.vouches = vouches,
    this.network = network
  }
}

export default WalletState;

export { networks };
