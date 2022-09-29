const contractAbi = [
  // Get the balance of a user
  "function balanceOf(address account) view returns (uint256)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)"
];

export default class TokenContract {
  constructor(
    ethereumClient,
    contractAddress,
  ) {
    this.contract = ethereumClient.getContract(contractAddress, contractAbi);
    this.mutableContract = ethereumClient.getMutableContract(this.contract);
  }
  async getSymbol() {  
    console.log(this.contract)  
    const symbol = await this.contract.symbol();
    console.log(symbol)
    return symbol
  }
  async getBalance(account) {
    try {
      const balance = await this.contract
        .balanceOf(account);
      return balance;
    } catch (e) {
      console.log("Error fetching token balance");
      console.log(e);
    }
    return 0;
  }

  async getTotalSupply() {
    try {
      const tSupply = await this.contract.totalSupply()
      return tSupply;
    } catch (e) {
      console.log("Error fetching token total-supply")
      console.log(e);
    }
  }
}
