import DexRouterContract from "@/data/network/web3/contracts/dexRouterContract";
import WeavrERC20Contract from "@/data/network/web3/contracts/weavrERC20Contract";

import { NETWORK } from "../constants";
import AssetContract from "@/data/network/web3/contracts/assetContract";
/**
 * DEX service
 * @param {EthereumClient} ethereumClient Ethereum client
 */
class DEX {
  constructor(ethereumClient) {
    this.ethereumClient = ethereumClient;
  }

  async getFrabricOrders(frabricId) {
    // const marketOrders = await this.graphQLAPIClient.query(
    //   FRABRIC_DEX_ORDERS_QUERY,
    //   { frabricId },
    //   (mapper, response) => {
    //     return mapper.mapRawMarketOrders(response);
    //   }
    // );
    // console.log(marketOrders);
    // return marketOrders;
  }

  async getThreadOrders(frabricId, threadId) {
    // const marketOrders = await this.graphQLAPIClient.query(
    //   THREAD_DEX_ORDERS_QUERY,
    //   { frabricId, threadId },
    //   (mapper, response) => {
    //     return mapper.mapRawMarketOrders(response);
    //   }
    // );

    // return marketOrders.length > 0 ? marketOrders : [];
  }

  async createBuyOrder(frabricAddress, price, minimumAmount) {
    const daoContract = new AssetContract(this.ethereumClient, frabricAddress);

    const erc20 = await daoContract.erc20();

    console.log(`ERC20: ${erc20}`);

    const dexRouterContract = new DexRouterContract(
      this.ethereumClient,
      process.env.VUE_APP_DEX_ROUTER
    );
    const status = dexRouterContract.buy(
      erc20,
      NETWORK.TRADE_TOKEN,
      price * minimumAmount,
      price,
      minimumAmount
    );
    return status;
  }

  async createSellOrder(frabricAddress, price, amount) {
    const daoContract = new AssetContract(this.ethereumClient, frabricAddress);

    const erc20 = await daoContract.erc20();

    const frabricTokenContract = new WeavrERC20Contract(
      this.ethereumClient,
      erc20
    );

    const status = await frabricTokenContract.sell(price, amount);
    return status;
  }
}

export default DEX;
