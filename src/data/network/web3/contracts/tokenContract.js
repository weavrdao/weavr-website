const contractAbi = [
  // Get the balance of a user
  "function balanceOf(address account) view returns (uint256)",
  "function symbol() view returns (string)"
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
    let symbol = await this.contract.symbol();
    return symbol
  }
  async getBalance(account) {
    try {

      console.log(this.contract);
      const balance = await this.contract
        .balanceOf(account);
      return balance;
    } catch (e) {
      console.log("Error fetching token balance");
      console.log(e);
    }
    return 0;
  }
}
