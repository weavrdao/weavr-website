import contractAbi from "./abi/Crowdfund";

class CrowdfundContract {
  constructor(
    ethereumClient,
    contractAddress
  ) {
    this.contract = ethereumClient.getContract(contractAddress, contractAbi)
    this.mutableContract = ethereumClient.getMutableContract(this.contract)
  }

  async state() {
    return (await this.contract.state());
  }

  /**
   * @ Deposit funds to a needle
   * @param {string} amount Amount of tokens to deposit into crowdfund
   */
  async deposit(amount) {
    console.log(amount)
    console.log(this.mutableContract)
    return (await this.mutableContract.deposit(amount));
  }

  async withdraw(amount) {
    console.log(amount)
    return (await this.mutableContract.withdraw(amount));
  }

  async redeem(address) {
    return (await this.mutableContract.redeem(address));
  }

  async token() {
    return (await this.contract.token());
  }

  async balanceOf(userAddress) {
    return (await this.contract.balanceOf(userAddress));
  }

}

export default CrowdfundContract;
