/* eslint-disable max-lines-per-function */
// import router from "../router/index";
import { ethers } from "ethers";
import ServiceProvider from "../services/provider";
import WalletState from "../models/walletState";
import { CONTRACTS, GUEST } from "../services/constants";
import {
  whitelistGetters,
  whitelistMutations,
  getCookie,
  setCookie,
} from "../whitelist";
import {USER_COOKIE_KEY} from "../whitelist/constants";

/**
 * TODO - Abstrucked -
 *  ;Implement clickable toast to link to chain explorer to review the tx
 */

const wallet = ServiceProvider.wallet();
const token = ServiceProvider.token();
const whitelist = ServiceProvider.whitelist();

function state() {
  // const walletCookie = getCookie(WALLET_STATE_COOKIE_KEY);

  return {
    user: {
      wallet: WalletState,
      isGuest: getCookie(USER_COOKIE_KEY) === GUEST,
      log: true,
      vouches: [],
    },

    interface: {
      alert: null,
      loading: {
        isLoading: false,
        message: ""
      }
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
  loadingState(state) {
    console.log(state.interface.loading)
    return state.interface.loading;
  },
  guestCookie(state) {
    return state.user.isGuest
  },
  userWalletAddress(state) {
    return state.user.wallet.address;
  },
  
  connectedNetwork() {
    return wallet.getChainId()
  },

  isConnected(state) {
    return ethers.utils.isAddress(state.user.wallet.address)
  },

  userTokenBalance(state) {
    if(state.user.wallet === undefined) {
      return 0
    } else {
      return state.user.wallet.tokenBalance;
      }
  },

  assetTokenSymbol(state) {
    return state.user.wallet.tokenSymbol;
  },

  userEthBalance(state) {
    return state.user.wallet.ethBalance;
  },

  vouchesPerSigner(state) {
    return state.user.wallet.vouches;
  },

  activeAlert(state) {
    return state.interface.alert;
  },


  ...whitelistGetters,
};

const actions = {
  async setLoadingState(context, loadingState) {
    context.commit("setLoadingState", loadingState)
  },
  async fetchTokenInfoForAddress(context, params) {
    return {
      // ...(await this.fetchTokenInfo(params)),
      bal: await token.getTokenBalance(params.tokenAddress, params.userAddress)
    }
  },
  async fetchTokenInfo(context, params) {
    // const toast = params.$toast || createToaster({});
    const tokenAddress = params.tokenAddress || CONTRACTS.TOKEN_ADDRESS;
    const supply = await token.getTotalSupply(tokenAddress);
    console.log(ethers.utils.formatEther(supply));
    return {
      totalSupply: ethers.utils.formatEther(supply),
    };
  },

  async updateWalletToken(context, params) {
    const {tokenAddress} = params;
    const address = context.getters.userWalletAddress;
    console.log("_________________________________________________", tokenAddress, address);
    const symbol = await token.getTokenSymbol(tokenAddress);
    const balance = await token.getTokenBalance(
      tokenAddress,
      address
    );
    Promise.allSettled([symbol, balance]).then( res => {
      console.log("DATA TOKEN ::::: ", res)
      const {symbol, balance} = res;
      const walletState = new WalletState(
        address, 
        0, 
       Number( ethers.utils.formatEther(res[1].value)).toFixed(6), 
        res[0].value, 
        null, 
        wallet.getChainId()
      )
      context.commit("setWallet", walletState);
      console.log(walletState);
    })
  },

  async syncWallet(context, params) {
    let {$toast} = params !== undefined ? params : {};
    let walletState = await wallet.getState(params.wallet);
    const symbol = await token.getTokenSymbol(CONTRACTS.TOKEN_ADDRESS);
    const balance = await token.getTokenBalance(
      CONTRACTS.TOKEN_ADDRESS,
      walletState.address
    );

    Promise.all([walletState, symbol, balance])
    const isWhitelisted = await whitelist.checkWhitelistedStatus(
      CONTRACTS.WEAVR,
      walletState.address
    );
    context.commit("setWhitelisted", isWhitelisted);
    isWhitelisted && setCookie(USER_COOKIE_KEY, walletState.address + "_" + params.wallet, 100)
    await token.getTokenBalance(
      CONTRACTS.TOKEN_ADDRESS,
      walletState.address
    );

    const hasKyc = await whitelist.hasKyc(
      CONTRACTS.WEAVR,
      walletState.address
    );

    walletState = new WalletState(
      walletState.address,
      walletState.ethBalance,
      ethers.utils.formatEther(balance).toString(),
      symbol,
      wallet.getChainId()
    );
    context.commit("setKyc", hasKyc);
    context.commit("setWallet", walletState);

    $toast.clear();
    $toast.success("Wallet fully synced", {
      duration: 1000,
      position: "top",
    });
  },

  async logout(context) {
    const state = wallet.disconnect();
    setCookie(USER_COOKIE_KEY, "NULL", 1)
    context.commit("setWallet", state)
  },

  


  
};

const mutations = {
  setWallet(state, wallet) {
    state.user.wallet = wallet;
  },

  setEthBalance(state, ethBalance) {
    state.user.wallet.ethBalance = ethBalance;
  },

  setAlert(state, alert) {
    state.interface.alert = alert;
  },

  setTokenBalance(state, balance) {
    state.user.wallet.tokenBalance = balance;
  },

  setTokenSymbol(state, symbol) {
    state.user.wallet.tokenSymbol = symbol;
  },

  setLoadingState(state, loadingState) {
    console.log("setting loading to: ", loadingState)
    state.interface.loading = loadingState;
    console.log("setting loading to: ", state.interface.loading)

  },

  setWalletConnetected(state) {
    if (state.user.wallet.connected != null) !state.user.wallet.connected;
  },

  ...whitelistMutations,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
