import TokenContract from "../../data/network/web3/contracts/tokenContract";

export default class Token {
  constructor(
    ethereumClient,
  ) {
    this.ethereumClient = ethereumClient;
  }

  async getTokenBalance(tokenAddress, userAddress) {
    let tokenContract =  new TokenContract(this.ethereumClient, tokenAddress);
    const balance = await tokenContract.getBalance(userAddress);
    tokenContract = null
    return balance
  }

  async getTokenSymbol(tokenAddress) {
    console.log("SYMBOL", this.ethereumClient.walletProvider);
    let tokenContract =  new TokenContract(this.ethereumClient, tokenAddress);
    const symbol = await tokenContract.getSymbol()
    tokenContract = null
    return symbol
  }

  async getTotalSupply(tokenAddress) {
    const tokenContract =  new TokenContract(this.ethereumClient, tokenAddress);
    const supply = await tokenContract.getTotalSupply()
    return supply
  }

  async getDecimals(tokenAddress) {
    const tokenContract =  new TokenContract(this.ethereumClient, tokenAddress);
    const decimals = await tokenContract.getDecimals()
    return decimals
  }
}

