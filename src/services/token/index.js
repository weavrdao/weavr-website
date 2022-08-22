import TokenContract from "../../data/network/web3/contracts/tokenContract";

export default class Token {
  constructor(
    ethereumClient,
  ) {
    this.ethereumClient = ethereumClient;
  }

  async getTokenBalance(tokenAddress, userAddress) {
    const tokenContract = new TokenContract(this.ethereumClient, tokenAddress);
    let balance = await tokenContract.getBalance(userAddress);
    return balance || 0;
  }
}
