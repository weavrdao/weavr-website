import { CONTRACTS } from "../../services/constants";
import { WHITELIST_COOKIE_KEY } from "../constants";
import { getCookie, setCookie } from "../cookies";

export function whitelistState() {
  return {
    whitelisted: getCookie(WHITELIST_COOKIE_KEY),
    hasKyc: null
  };
}

export const whitelistGetters = {
  isWhitelisted(state) {
    return state.whitelisted;
  },
  hasKyc(state) {
    return state.hasKyc
  }
};

export const whitelistActions = (whitelistService) => ({
  async checkWhitelistStatus(context, params) {
    const userWalletAddress = context.getters.userWalletAddress;
    const assetId = params.assetId || CONTRACTS.WEAVR;
    console.log({userWalletAddress, assetId})
    try {
      const whitelisted = await whitelistService.checkWhitelistedStatus(
        assetId,
        userWalletAddress
      );
      context.commit("setWhitelisted", whitelisted);
    } catch (error) {
      console.log("Error fethcing whitelist status");
      console.error(error);
    }
  },
  async  checkKyc(context, params) {
    const userWalletAddress = context.getters.userWalletAddress;
    const assetId = params.assetId || CONTRACTS.WEAVR;
    try {
      const kyc = await whitelistService.hasKyc(
        assetId,
        userWalletAddress
      );
      console.log("KYC: ", kyc)
      context.commit("setKyc", kyc);
    } catch (error) {
      console.log("Error fethcing kyc status");
      console.error(error);
    }
  },
});

export const whitelistMutations = {
  setWhitelisted(state, whitelisted) {
    setCookie(WHITELIST_COOKIE_KEY, whitelisted, 100)
    state.whitelisted = whitelisted;
  },
  setKyc(state, kyc) {
    state.hasKyc = kyc;
  },
};

