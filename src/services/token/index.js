import TokenContract from "../../data/network/web3/contracts/tokenContract";

function awaitOn(promise) {
  Promise.all([promise]).then(
    () => {
      return promise;
    }
  )
}

export default class Token {
  constructor(
    ethereumClient,
  ) {
    this.ethereumClient = ethereumClient;
  }

  async getTokenBalance(tokenAddress, userAddress) {
    const tokenContract =  new TokenContract(this.ethereumClient, tokenAddress);
    const balance = await tokenContract.getBalance(userAddress);
    return balance
  }

  async getTokenSymbol(tokenAddress) {
    console.log("SYMBOL", this.ethereumClient.walletProvider);
    const tokenContract =  new TokenContract(this.ethereumClient, tokenAddress);
    const symbol = await tokenContract.getSymbol()
    return symbol
  }

  async getTotalSupply(tokenAddress) {
    const tokenContract =  new TokenContract(this.ethereumClient, tokenAddress);
    const supply = await tokenContract.getTotalSupply()
    return supply
  }
}

