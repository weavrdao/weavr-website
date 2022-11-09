import { WHITELIST_COOKIE_KEY } from "../constants";
import { getCookie } from "../cookies";

export function whitelistState() {
  return {
    whitelisted: getCookie(WHITELIST_COOKIE_KEY),
  };
}

export const whitelistGetters = {
  isWhitelisted(state) {
    return state.whitelisted;
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
