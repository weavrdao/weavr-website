import { ethers } from "ethers";
import { USER_COOKIE_KEY } from "../constants";
import { getCookie } from "../cookie";
export function whitelistState() {
  return {
    whitelisted: getCookie(USER_COOKIE_KEY) || null,
  };
}

export const whitelistGetters = {
  isWhitelisted(state) {
    console.log("??? WHITELISTED____", state.whitelisted)
    const x = getCookie(USER_COOKIE_KEY)
    console.log(x);
    return ethers.utils.isAddress(x);
  },
};

export const whitelistActions = (whitelistService) => ({
  async checkWhitelistStatus(context, params) {
    const userWalletAddress = context.getters.userWalletAddress;
    const assetId = params.assetId || process.env.VUE_APP_WEAVR_ADDRESS;
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
});

export const whitelistMutations = {
  setWhitelisted(state, whitelisted) {
    state.whitelisted = whitelisted;
  },
};
