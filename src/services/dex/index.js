import { ethers } from "ethers";
import DexRouterContract from "@/data/network/web3/contracts/dexRouterContract";
import WeavrERC20Contract from "@/data/network/web3/contracts/weavrERC20Contract";
import InfuraEventCacheClient from "@/data/network/web3/events/InfuraEventCacheClient"

import { CONTRACTS, NETWORK } from "../constants";
import AssetContract from "@/data/network/web3/contracts/assetContract";
/**
 * DEX service
 * @param {EthereumClient} ethereumClient Ethereum client
 */
class DEX {
  constructor(ethereumClient) {
    this.ethereumClient = ethereumClient;
    this.cacheClient = new InfuraEventCacheClient(NETWORK.id, process.env.VUE_APP_INFURA_API_KEY, NETWORK.startBlock)
  }

  async createBuyOrder(assetId, price, minimumAmount) {
    const daoContract = new AssetContract(this.ethereumClient, assetId);

    const erc20 = await daoContract.erc20();
    const frabricTokenContract = new WeavrERC20Contract(this.ethereumClient, erc20);
    const decimals = await frabricTokenContract.decimals();

    const dexRouterContract = new DexRouterContract(
      this.ethereumClient,
      CONTRACTS.DEX_ROUTER
    );

    const amountToSend = ethers.utils.parseUnits(String(price * minimumAmount), decimals);
    const minAmountReceive = ethers.utils.parseUnits(String(minimumAmount), decimals);
    
    console.log({
      dexRouterContract,
      erc20,
      tradeToken: CONTRACTS.TRADE_TOKEN,
      amountToSend,
      price,
      minimumAmount
    })

    const status = dexRouterContract.buy(
      erc20,
      CONTRACTS.TRADE_TOKEN,
      amountToSend,
      price,
      minAmountReceive
    );
    return status;
  }

  async approveDexRouterTradeToken() {
    const erc20Contract = new WeavrERC20Contract(this.ethereumClient, CONTRACTS.TRADE_TOKEN);
    const status = await erc20Contract.approve(CONTRACTS.DEX_ROUTER);

    return status;
  }

  async approveDexRouterThreadToken(assetId) {
    const daoContract = new AssetContract(this.ethereumClient, assetId);
    const erc20 = await daoContract.erc20();
    const erc20Contract = new WeavrERC20Contract(this.ethereumClient, erc20);
    const status = await erc20Contract.approve(CONTRACTS.DEX_ROUTER);

    return status;
  }

  async createSellOrder(assetId, price, amount) {
    const daoContract = new AssetContract(this.ethereumClient, assetId);

    const erc20 = await daoContract.erc20();

    const frabricTokenContract = new WeavrERC20Contract(
      this.ethereumClient,
      erc20
    );

    const status = await frabricTokenContract.sell(price, amount);
    return status;
  }

  async cancelOrder(assetId, price, pricePointIndex) {
    const daoContract = new AssetContract(this.ethereumClient, assetId);

    const erc20 = await daoContract.erc20();

    const frabricTokenContract = new WeavrERC20Contract(
      this.ethereumClient,
      erc20
    );

    const status = await frabricTokenContract.cancelOrder(price, pricePointIndex);

    return status;
  }
}

export default DEX;
