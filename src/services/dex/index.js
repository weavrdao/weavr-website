import { GraphQLAPIClient } from "../../data/network/graph/graphQLAPIClient";
import EthereumClient from "../../data/network/web3/ethereum/ethereumClient";
import DexRouterContract from "../../data/network/web3/contracts/dexRouterContract";
import FrabricERC20Contract from "../../data/network/web3/contracts/frabricERC20Contract";
import AssetContract from "../../data/network/web3/contracts/assetContract";
import USDCContract from "../../data/network/web3/contracts/usdcContract";
import {
  FRABRIC_DEX_ORDERS_QUERY,
  THREAD_DEX_ORDERS_QUERY,
} from "../../data/network/graph/queries";
import { TRADE_TOKEN_ADDRESS } from "../constants";
import {
  multiplyAsBigNumbers,
  parseUnitsAsBigNumbers,
} from "../../data/helpers/numbers";

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

    const decimals = await this.getTradeTokenDecimals(frabricAddress);
    const amount = parseUnitsAsBigNumbers(minimumAmount, decimals);
    const convertedPrice = parseUnitsAsBigNumbers(price, decimals);
    const totalAmount = multiplyAsBigNumbers(amount, price);

    const status = await dexRouterContract.buy(
      erc20,
      TRADE_TOKEN_ADDRESS,
      totalAmount,
      convertedPrice,
      minimumAmount
    );
    return status;
  }

  async createSellOrder(frabricAddress, price, amount) {
    const daoContract = new AssetContract(this.ethereumClient, frabricAddress);

    const erc20 = await daoContract.erc20();
    const decimals = await this.getTradeTokenDecimals(frabricAddress);
    const convertedPrice = parseUnitsAsBigNumbers(price, decimals);

    const frabricTokenContract = new FrabricERC20Contract(
      this.ethereumClient,
      erc20
    );

    const status = await frabricTokenContract.sell(convertedPrice, amount);
    return status;
  }

  async getTradeTokenAddress(frabricAddress) {
    try {
      const daoContract = new AssetContract(
        this.ethereumClient,
        frabricAddress
      );
      const erc20Address = await daoContract.erc20();
      const frabricERC20Contract = new FrabricERC20Contract(
        this.ethereumClient,
        erc20Address
      );
      const tradeTokenAddress = await frabricERC20Contract.tradeToken();
      return tradeTokenAddress;
    } catch (e) {
      console.log("Error fetching trade token address");
      console.error(e);
      return null;
    }
  }

  async getAllowance(frabricAddress, userAddress) {
    const tradeTokenAddress = this.getTradeTokenAddress(frabricAddress);
    const usdcContract = new USDCContract(
      this.ethereumClient,
      tradeTokenAddress
    );
    return await usdcContract.allowance(
      userAddress,
      process.env.VUE_APP_DEX_ROUTER
    );
  }

  async approveTradeToken(frabricAddress) {
    const tradeTokenAddress = this.getTradeTokenAddress(frabricAddress);
    const usdcContract = new USDCContract(
      this.ethereumClient,
      tradeTokenAddress
    );
    return await usdcContract.approve(process.env.VUE_APP_DEX_ROUTER);
  }

  async getBalance(frabricAddress, userAddress) {
    const tradeTokenAddress = this.getTradeTokenAddress(frabricAddress);
    const usdcContract = new USDCContract(
      this.ethereumClient,
      tradeTokenAddress
    );
    return await usdcContract.balanceOf(userAddress);
  }

  async getTradeTokenDecimals(frabricAddress) {
    const tradeTokenAddress = this.getTradeTokenAddress(frabricAddress);
    const usdcContract = new USDCContract(
      this.ethereumClient,
      tradeTokenAddress
    );
    return await usdcContract.decimals();
  }
}

export default DEX;
