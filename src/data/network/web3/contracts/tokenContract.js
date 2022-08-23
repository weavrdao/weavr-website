const contractAbi = [
  // Get the balance of a user
  "function balanceOf(address account) view returns (uint256)",
];

export default class TokenContract {
  constructor(
    ethereumClient,
    contractAddress,
  ) {
    this.contract = ethereumClient.getContract(contractAddress, contractAbi);
    this.mutableContract = ethereumClient.getMutableContract(this.contract);
  }

  async getBalance(account) {
    try {
      console.log(this.contract);
      const balance = await this.contract
        .balanceOf(account, {
          gasLimit: 50000000,
        });
      return balance;
    } catch (e) {
      console.log("Error fetching token balance");
      console.log(e);
    }
    return 0;
  }
}
