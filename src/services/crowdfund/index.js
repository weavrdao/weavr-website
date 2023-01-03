/* eslint-disable class-methods-use-this */
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient";
import CrowdfundContract from "../../data/network/web3/contracts/crowdfundContract";
import USDCContract from "../../data/network/web3/contracts/usdcContract";

/**
 * Crowdfund service
 * @property {EthereumClient} client Ethereum client
 */
class Crowdfund {
  constructor(ethereumClient) {
    this.client = ethereumClient;
  }

  async getState(crowdfundAddress) {
    const crowdfundContract = new CrowdfundContract(this.client, crowdfundAddress);

    const state = await crowdfundContract.state();
    return state;
  }

  async deposit(crowdfundAddress, amount) {
    const crowdfundContract = new CrowdfundContract(this.client, crowdfundAddress);

    const status = await crowdfundContract.deposit(amount);
    return status;
  }

  async withdraw(crowdfundAddress, amount) {
    const crowdfundContract = new CrowdfundContract(this.client, crowdfundAddress);

    const status = await crowdfundContract.withdraw(amount);
    return status;
  }

  async redeem(crowdfundAddress, userAddress) {
    const crowdfundContract = new CrowdfundContract(this.client, crowdfundAddress);

    const status = await crowdfundContract.redeem(userAddress);
    return status;
  }

  async getTradeTokenAddress(crowdfundAddress) {
    try {
      const crowdfundContract = new CrowdfundContract(
        this.client,
        crowdfundAddress
      );
      const tradeTokenAddress = await crowdfundContract.token();
      return tradeTokenAddress;
    } catch (e) {
      console.log("Error fetching trade token address");
      console.error(e);
      return null;
    }
  }

  async getAllowance(crowdfundAddress, userAddress) {
    const tradeTokenAddress = this.getTradeTokenAddress(crowdfundAddress);
    const usdcContract = new USDCContract(
      this.client,
      tradeTokenAddress
    );
    return await usdcContract.allowance(
      userAddress,
      crowdfundAddress,
    );
  }

  async approveTradeToken(crowdfundAddress) {
    const tradeTokenAddress = this.getTradeTokenAddress(crowdfundAddress);
    const usdcContract = new USDCContract(
      this.client,
      tradeTokenAddress
    );
    return await usdcContract.approve(crowdfundAddress);
  }

  async getBalance(crowdfundAddress, userAddress) {
    const tradeTokenAddress = this.getTradeTokenAddress(crowdfundAddress);
    const usdcContract = new USDCContract(
      this.client,
      tradeTokenAddress
    );
    return await usdcContract.balanceOf(userAddress);
  }

  async getTradeTokenDecimals(crowdfundAddress) {
    const tradeTokenAddress = this.getTradeTokenAddress(crowdfundAddress);
    const usdcContract = new USDCContract(
      this.client,
      tradeTokenAddress
    );
    return await usdcContract.decimals();
  }

  async getCrowdfundBalance(crowdfundAddress, userAddress) {
    const crowdfundContract = new CrowdfundContract(this.client, crowdfundAddress);
    const balance = await crowdfundContract.balanceOf(userAddress);
    return balance;
  }
}

export default Crowdfund;
