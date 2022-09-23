import { GraphQLAPIClient } from "../../data/network/graph/graphQLAPIClient";
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient";
import DexRouterContract from "../../data/network/web3/contracts/dexRouterContract";
import FrabricERC20Contract from "../../data/network/web3/contracts/frabricERC20Contract";
import AssetContract from "../../data/network/web3/contracts/assetContract";
import {
  FRABRIC_DEX_ORDERS_QUERY,
  THREAD_DEX_ORDERS_QUERY,
} from "../../data/network/graph/queries";
import { TRADE_TOKEN_ADDRESS } from "../constants";

/**
 * DEX service
 * @param {EthereumClient} ethereumClient Ethereum client
 * @param {GraphQLAPIClient} graphQLAPIClient GraphQL API Client
 */
class DEX {
  constructor(ethereumClient, graphQLAPIClient) {
    this.ethereumClient = ethereumClient;
    this.graphQLAPIClient = graphQLAPIClient;
  }

  async getFrabricOrders(frabricId) {
    const marketOrders = await this.graphQLAPIClient.query(
      FRABRIC_DEX_ORDERS_QUERY,
      { frabricId },
      (mapper, response) => {
        return mapper.mapRawMarketOrders(response);
      }
    );
    console.log(marketOrders);
    return marketOrders;
  }

  async getThreadOrders(frabricId, threadId) {
    const marketOrders = await this.graphQLAPIClient.query(
      THREAD_DEX_ORDERS_QUERY,
      { frabricId, threadId },
      (mapper, response) => {
        return mapper.mapRawMarketOrders(response);
      }
    );

    return marketOrders.length > 0 ? marketOrders : [];
  }

  async createBuyOrder(frabricAddress, price, minimumAmount) {
    const daoContract = new AssetContract(this.ethereumClient, frabricAddress);

    const erc20 = await daoContract.erc20();

    console.log(`ERC20: ${erc20}`);

    const dexRouterContract = new DexRouterContract(
      this.ethereumClient,
      process.env.VUE_APP_DEX_ROUTER
    );

    const status = await dexRouterContract.buy(
      erc20,
      TRADE_TOKEN_ADDRESS,
      price * minimumAmount,
      price,
      minimumAmount
    );
    return status;
  }

  async createSellOrder(frabricAddress, price, amount) {
    const daoContract = new AssetContract(this.ethereumClient, frabricAddress);

    const erc20 = await daoContract.erc20();

    const frabricTokenContract = new FrabricERC20Contract(
      this.ethereumClient,
      erc20
    );

    const status = await frabricTokenContract.sell(price, amount);
    return status;
  }
}

export default DEX;
