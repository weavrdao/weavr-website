/* eslint-disable max-lines-per-function */
// import router from "../router/index";
import { ethers } from "ethers";
import { createToaster } from "@meforma/vue-toaster";
import { params } from "stylus/lib/utils";
import ServiceProvider from "../services/provider";
import WalletState from "../models/walletState";
import { CONTRACTS, DAO, GUEST, NETWORK } from "../services/constants";
import {
  whitelistState,
  whitelistGetters,
  whitelistActions,
  whitelistMutations,
  getCookie,
  setCookie,
  WHITELIST_COOKIE_KEY,
  WALLET_STATE_COOKIE_KEY,
  addressMatchesCookie,
} from "../whitelist";
import { USER_COOKIE_KEY } from "../whitelist/constants";
import blacklist from "@/blacklist.json";
import { hexToDecimals } from "../data/helpers/numbers";
import { crowfundStates } from "./helpers";


/**
 * TODO - Abstrucked -
 *  ;Implement clickable toast to link to chain explorer to review the tx
 */

const wallet = ServiceProvider.wallet();
const market = ServiceProvider.market();
const dao = ServiceProvider.dao();
const dex = ServiceProvider.dex();
const whitelist = ServiceProvider.whitelist();
const crowdfund = ServiceProvider.crowdfund();
const token = ServiceProvider.token();

function state() {
  // const walletCookie = getCookie(WALLET_STATE_COOKIE_KEY);

  return {
    platform: {
      assets: [],
      proposals: [], // new Map()
    },
    exchange: {
      orders: null,
      tokenAddress: null,
      crowdfundState: null,
    },
  };
}

/**
 * Note:
 * I haven"t spent too much time figuring out how to pass arguments to Vuex getters, only knowing that it"s not well-supported natively.
 * So for the first implementation whenever we need to get a subset of data for particular parameters —
 * — we return a Map from the corresponding getter, so that the consuming part can access the data with one key lookup operation.
 *
 * Pretty suboptimal, but at the time of writing this the bigger picture matters the most!
 */

const getters = {
  marketplaceActiveAssets(state) {
    return state.platform.assets;
  },

  userTradeTokenBalance(state) {
    return state.exchange.tradeTokenBalance;
  },

  userTradeTokenAllowance(state) {
    return state.exchange.tradeTokenAllowance;
  },

  userCrowdfundTokenAllowance(state) {
    return state.exchange.crowdfundTokenBalance;
  },

  crowdfundState(state) {
    return state.exchange.crowdfundState;
  },

  allThreads(state) {
    return state.platform.threads;
  },
  
  allNeedles(state) {
    return state.platform.needles.filter( needle => needle.state != "Finished");
  },
  
  threadById(state) {
    var assetMap = new Map();
    state.platform.threads?.forEach((asset) => {
      assetMap.set(asset.id, asset);
    });
    return assetMap;
  },
  
  needleById() {
    var assetMap = new Map();
    state.platform.needle?.forEach((asset) => {
      assetMap.set(asset.id, asset);
    });
    return assetMap;
  },

  assetMarketOrders(state) {
    return state.exchange.orders;
  },

  ownedAssets(state) {
    return (
      state.platform.assets?.filter((asset) => {
        return asset.owners.get(state.user.wallet.address);
      }) || null
    );
  },

};

const actions = {
 
  async refreshThreads(context) {
    let assets = await market.getThreads();
    context.commit("setThreads", assets);
  },
  
  async refreshNeedles(context) {
    const needles = await market.getNeedles();
    console.log(needles);
    context.commit("setNeedles", needles);
  },
  

  async fetchOrders(context, params) {
    let orders = await dex.getFrabricOrders(params.assetId.toLowerCase());
    context.commit("setOrders", orders);
  },

  // Ignore, rewrite
  async fetchDexOrders(context, params) {
    const FRABRIC_ID = "0";
    let orders = await dex.getAssetOrders(
      FRABRIC_ID,
      params.assetId.toString()
    );
    const tokenAddress = await dao.getTokenAddress();
    context.commit("setTokenAddress", tokenAddress);
    context.commit("setOrders", orders);
  },

  async createBuyOrder(_, params) {
    const { assetId, price, amount } = params;

    await dex.createBuyOrder(assetId, price, amount);
  },

  async createSellOrder(_, params) {
    const { assetId, price, amount } = params;

    await dex.createSellOrder(assetId, price, amount);
  },

  async redeem(context, params) {
    const { crowdfundAddress } = params;
    const userAddress = context.getters.userWalletAddress;
    console.log(userAddress);
    await crowdfund.redeem(crowdfundAddress, userAddress);
  },

  async deposit(context, params) {
    const { crowdfundAddress, amount } = params;
    console.log(amount);
    const parsedAmount = ethers.utils.parseUnits(String(amount), 6);
    console.log(parsedAmount);

    const status = await crowdfund.deposit(crowdfundAddress, parsedAmount);
    return status;
  },

  async withdraw(context, params) {
    const { crowdfundAddress, amount } = params;
    console.log(amount);
    const parsedAmount = ethers.utils.parseUnits(String(amount), 6);
    console.log(parsedAmount);

    const status = await crowdfund.withdraw(crowdfundAddress, parsedAmount);
    return status;
  },
 
  async approveTradeToken(context, params) {
    const { assetId } = params;
    await crowdfund.approveTradeToken(assetId);
    context.dispatch("fetchNeedleTokenData", { assetId: params.assetId })
  },

  async fetchNeedleTokenData(context, params) {
    const { assetId } = params;
    const walletState = await wallet.getState();

    const address = context.userWalletAddress || walletState.address;

    if(!address) {
      console.error("No wallet connected, cannot get trade token allowance");
      return;
    }

    // const allowance = await crowdfund.getAllowance(assetId, address);
    // const state = await crowdfund.getState(assetId);
    // const tradeTokenBalance = await crowdfund.getBalance(assetId, address);
    // const crowdfundTokenBalance = await crowdfund.getCrowdfundBalance(assetId, address);

    // context.commit(
    //   "setCrowdfundState",
    //   crowfundStates[String(state)] || null,
    // )

    // if(allowance) {
    //   context.commit(
    //     "setTradeTokenAllowance",
    //     hexToDecimals(allowance, 6),
    //   );
    // }

    // if(tradeTokenBalance) {
    //   context.commit(
    //     "setTradeTokenBalance",
    //     hexToDecimals(tradeTokenBalance, 6),
    //   );
    // }

    // if(crowdfundTokenBalance) {
    //   context.commit(
    //     "setCrowdfundTokenBalance",
    //     hexToDecimals(crowdfundTokenBalance, 6)
    //   );
    // }
  },
  async fetchThreadTokenData(context, params) {
    const { assetId } = params;
    const walletState = await wallet.getState();

    const address = context.userWalletAddress || walletState.address;

    if(!address) {
      console.error("No wallet connected, cannot get trade token allowance");
      return;
    }

    const allowance = await crowdfund.getAllowance(assetId, address);
    const state = await crowdfund.getState(assetId);
    const tradeTokenBalance = await crowdfund.getBalance(assetId, address);
    const crowdfundTokenBalance = await crowdfund.getCrowdfundBalance(assetId, address);

    context.commit(
      "setCrowdfundState",
      crowfundStates[String(state)] || null,
    )

    if(allowance) {
      context.commit(
        "setTradeTokenAllowance",
        hexToDecimals(allowance, 6),
      );
    }

    if(tradeTokenBalance) {
      context.commit(
        "setTradeTokenBalance",
        hexToDecimals(tradeTokenBalance, 6),
      );
    }

    if(crowdfundTokenBalance) {
      context.commit(
        "setCrowdfundTokenBalance",
        hexToDecimals(crowdfundTokenBalance, 6)
      );
    }
  },
  ...whitelistActions(whitelist),
};

const mutations = {
  
  
  setThreads(state, assets) {
    state.platform.threads = assets;
  },
  setNeedles(state, needles) {
    state.platform.needles = needles;
  },
  setOrders(state, orders) {
    state.exchange.orders = orders;
  },
  setTokenAddress(state, tokenAddress) {
    state.exchange.tokenAddress = tokenAddress;
  },

  setTradeTokenAllowance(state, allowance) {
    state.exchange.tradeTokenAllowance = allowance;
  },

  setTradeTokenBalance(state, balance) {
    state.exchange.tradeTokenBalance = balance;
  },

  setCrowdfundTokenBalance(state, balance) {
    state.exchange.crowdfundTokenBalance = balance;
  },

  setCrowdfundState(state, crowdfundState) {
    state.exchange.crowdfundState = crowdfundState;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
