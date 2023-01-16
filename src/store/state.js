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


/**
 * TODO - Abstrucked -
 *  ;Implement clickable toast to link to chain explorer to review the tx
 */

const wallet = ServiceProvider.wallet();
const dao = ServiceProvider.dao();
const token = ServiceProvider.token();
const whitelist = ServiceProvider.whitelist();

function state() {
  // const walletCookie = getCookie(WALLET_STATE_COOKIE_KEY);

  return {
    user: {
      wallet: WalletState,
      isGuest: getCookie(USER_COOKIE_KEY) === GUEST ? true : null,
      log: true,
      vouches: [],
    },
    platform: {
      assets: [],
      proposals: [], // new Map()
    },
    interface: {
      alert: null,
      isLoading: false,
    },
    ...whitelistState(),
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
  isLoading(state) {
    return state.interface.isLoading;
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
    return state.user.wallet.tokenBalance;
  },

  assetTokenSymbol(state) {
    return state.user.wallet.tokenSymbol;
  },

  userEthBalance(state) {
    return state.user.wallet.ethBalance;
  },

  allAssets(state) {
    return state.platform.assets;
  },

  assetsById(state) {
    var assetMap = new Map();
    state.platform.assets.forEach((asset) => {
      assetMap.set(asset.id, asset);
    });
    return assetMap;
  },

  proposalsPerAsset(state) {
    if (state.platform.proposals.length < 1) {
      dao.getProposalsForAsset();
    }
  },

  assetsAddressById(state) {
    var assetMap = new Map();
    state.platform.assets.forEach((asset) => {
      assetMap.set(asset.id, asset.contract);
    });

    return assetMap;
  },

  marketplaceActiveAssets(state) {
    return state.platform.assets;
  },

  ownedAssets(state) {
    return state.platform.assets.filter((asset) => {
      return asset.owners.get(state.user.wallet.address);
    });
  },

  vouchesPerSigner(state) {
    let signer = state.user.wallet.address;
    return state.user.wallet.vouches;
  },



  assetProposals(state) {
    return state.platform.proposals.filter((proposal) => {
      const isBlacklisted = blacklist.addresses.some((address) => {
        return address.toLowerCase() === proposal.creator.toLowerCase();
      });
      return !isBlacklisted;
    });
  },

  proposalsById(state) {
    const proposalsMap = new Map();
    Array.from(state.platform.proposals.values())
      .flatMap((p) => {
        return p;
      })
      .forEach((p) => {
        proposalsMap.set(p.id, p);
      });

    return proposalsMap;
  },

  activeAlert(state) {
    return state.interface.alert;
  },

  ...whitelistGetters,
};

const actions = {
  connectGuest(context, params) {
    console.log(params.passwd === process.env.VUE_APP_DAILY_PASSWORD ? "yess" : "noooo")
    if (
      params.passwd === process.env.VUE_APP_DAILY_PASSWORD
    ) {
      setCookie(USER_COOKIE_KEY, GUEST, 1)
      context.state.isGuest = getCookie(USER_COOKIE_KEY) === GUEST ? true : false
      return true
    }
    return false
  },

  async fetchTokenInfoForAddress(context, params) {
    return {
      ...(await this.fetchTokenInfo(context, params)),
      bal: await token.getTokenBalance(params.tokenAddress, params.userAddress)
    }
  },

  async fetchTokenInfo(context, params) {
    // const toast = params.$toast || createToaster({});
    const tokenAddress = params.tokenAddress || CONTRACTS.TOKEN_ADDRESS;
    const supply = await token.getTotalSupply(tokenAddress);
    const symbol = await token.getTokenSymbol(tokenAddress);
    return {
      totalSupply: ethers.utils.formatEther(supply),
      symbol
    };
  },

  async getVotingPower(context, params) {
    const userTokenInfo = this.fetchTokenInfoForAddress(context, params);
    const supplyWasZero = userTokenInfo.supply === 0;
    if (supplyWasZero) return {
      votingPower: 0,
      supplyWasZero
    };

    let votingPower = userTokenInfo.bal / userTokenInfo.supply;
    if (votingPower >= 0.1) votingPower = userTokenInfo.bal * 0.1;
    return {
      votingPower,
      supplyWasZero
    }
  },

  async syncWallet(context, params) {
    console.log("SYNC");
    let { $toast } = params !== undefined ? params : {};
    let walletState = await wallet.getState(params.wallet);
    const symbol = await token.getTokenSymbol(CONTRACTS.TOKEN_ADDRESS);
    const balance = await token.getTokenBalance(
      CONTRACTS.TOKEN_ADDRESS,
      walletState.address
    );

    Promise.all([walletState, symbol, balance]).then((val) => {
      console.log(val);
    });

    const isWhitelisted = await whitelist.checkWhitelistedStatus(
      CONTRACTS.WEAVR,
      walletState.address
    );

    context.commit("setWhitelisted", isWhitelisted);
    isWhitelisted && setCookie(USER_COOKIE_KEY, walletState.address, 100)
    const balancePromise = await token.getTokenBalance(
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

  async refreshProposalsDataForAsset(context, params) {
    // NOTE (bill) Quick fix to allow loading from child paths, better solutions available
    if (context.getters.assetProposals.length > 1 && !params.forceRefresh)
      return false;
    const toast = params.$toast || createToaster({});
    toast.info("Loading Data....");
    let assetId = params.assetId.toLowerCase();
    let assetProposals = await dao.getProposalsForAsset(assetId);

    context.commit("setProposalsForAsset", {
      assetId: assetId.toLowerCase(),
      proposals: assetProposals,
    });
    toast.clear();
  },

  async createPaperProposal(context, props) {
    const { assetAddr, daoResolution, title, description, forumLink } = props;
    const toast = params.$toast || createToaster({});

    toast.clear();
    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });

    const status = await dao
      .createPaperProposal(assetAddr, title, description, forumLink, daoResolution)
      .then(() => {
        props.$toast.clear();
      });
    Promise.resolve([status]).then((status) => {
      if (status) {
        toast.success("Transaction confirmed!");
      } else {
        toast.error("Transaction failed. See details in MetaMask.");
        console.log("Transaction failed. See details in MetaMask.");
      }
    });
  },

  async createParticipantProposal(context, props) {
    const toast = params.$toast || createToaster({});
    const { assetId, participantType, participant, title, description, forumLink } = props;

    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });
    const status = await dao.createParticipantProposal(
      assetId,
      participantType,
      participant,
      title,
      description,
      forumLink
    );
    toast.clear();
    if (status) {
      toast.success("Transaction confirmed!");
      context.dispatch("refreshProposalsDataForAsset", {
        assetId: params.assetId,
      });
      // router.push("/" + DAO + "/" + params.assetId);
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
  },

  async createUpgradeProposal(context, props) {
    const toast = params.$toast || createToaster({});
    const {
      assetAddress,
      beaconAddress,
      instanceAddress,
      version,
      codeAddress,
      title,
      description,
      forumLink,
      signer,
      governor,
    } = props;

    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });
    const status = await dao.createUpgradeProposal(
      assetAddress,
      beaconAddress,
      instanceAddress,
      codeAddress,
      title,
      description,
      forumLink,
      version,
      signer,
      governor
    );

    toast.clear();
    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
      context.dispatch("refreshProposalsDataForAsset", {
        assetId: params.assetId,
      });
      // router.push("/" + DAO + "/" + params.assetId);
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
  },

  async createTokenActionProposal(context, props) {
    const toast = params.$toast || createToaster({});

    console.log("Calling!");

    const {
      assetId,
      mint,
      target,
      price,
      amount,
      title,
      description,
      forumLink,
    } = props;

    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });

    const tokenAddress = await dao.getTokenAddress(CONTRACTS.WEAVR);

    const atomicAmount = ethers.utils.parseEther(String(amount));

    const status = await dao.createTokenActionProposal(
      assetId,
      tokenAddress,
      target,
      mint,
      price,
      atomicAmount,
      title,
      description,
      forumLink,
    );
    // router.push(DAO);
    toast.clear();
    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
    return status;
  },

  async createThreadProposal(context, props) {
    const toast = params.$toast || createToaster({});

    const {
      assetId,
      name,
      descriptor,
      title,
      description,
      forumLink,
      symbol,
      tradeToken,
      target,
      images,
      documents,
    } = props;

    toast.info("Uploading files to IPFS (this may take some time)", {
      duration: 10000,
      position: "bottom",
    });

    const status = await dao.createThreadProposal(
      assetId,
      name,
      descriptor,
      title,
      description,
      forumLink,
      symbol,
      tradeToken,
      target,
      images,
      documents,
    );
    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
      context.dispatch("refreshProposalsDataForAsset", {
        assetId: params.assetId,
      });
      // router.push(`/${DAO}/${params.assetId}`);
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
    console.log(status);
    return status;
  },

  async vote(context, props) {
    const toast = params.$toast || createToaster({});

    const { assetAddress, proposalId, votes } = props;

    const status = await dao.vote(
      assetAddress || CONTRACTS.WEAVR,
      proposalId,
      votes
    );
    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
      context.dispatch("refreshProposalsDataForAsset", {
        assetId: params.assetId,
      });
      // router.push("/" + DAO + "/" + params.assetId);
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
    console.log(status);
  },

  async withdraw(context, props) {
    const toast = params.$toast || createToaster({});

    const { assetAddress, proposalId } = props;

    const status = await dao.withdraw(
      assetAddress || CONTRACTS.WEAVR,
      proposalId,
    );

    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
    console.log(status);
  },

  async queueProposal(context, props) {
    const toast = params.$toast || createToaster({});
    const id = ethers.BigNumber.from(props.proposalId)

    const status = await dao.queue(id);
    console.log(status)

  },

  async completeProposal(context, props) {
    const toast = params.$toast || createToaster({});
    const id = ethers.BigNumber.from(props.proposalId)
    const DATA = params.data || "0x000000"
    const status = await dao.complete(id, DATA);
    console.log(status)
  },

  async vouchParticipant(context, props) {
    const toast = params.$toast || createToaster({});
    const { customDomain, participant } = props;

    const domain = customDomain || {
      name: "Weavr Protocol",
      version: "1",
      chainId: NETWORK.id,
      verifyingContract: CONTRACTS.WEAVR
    };
    const types = {
      Vouch: [{ type: "address", name: "participant" }],
    };
    const data = {
      participant: participant
    };

    toast.info("Waiting for signature..", { position: "top" });

    const signatures = await wallet.getSignature(domain, types, data);
    Promise.all([signatures])
      .then(() => {
        // console.log(signature[0]);
        const expectedSignerAddress = context.state.user.wallet.address;
        const recoveredAddress = ethers.utils.verifyTypedData(domain, types, data, signatures[0]);
        console.log("Signer Address CHECK______\n", recoveredAddress, "\n", expectedSignerAddress);
        console.log(recoveredAddress.toLowerCase() === expectedSignerAddress.toLowerCase());
      });
    const signature = signatures[0]
    console.log(signature);
    const status = await dao.vouch(participant, signature);

    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
      context.dispatch("refreshProposalsDataForAsset", {
        assetId: params.assetId,
      });
      // router.push("/" + DAO + "/" + params.assetId);
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
  },

  async verifyParticipant(context, props) {
    const toast = params.$toast || createToaster({});
    const { customDomain, participant, pType, kycHash, nonce } = props;
    console.log({ customDomain, participant, pType, kycHash, nonce })
    const domain = customDomain || {
      name: "Weavr Protocol",
      version: "1",
      chainId: NETWORK.id,
      verifyingContract: CONTRACTS.WEAVR
    };
    const types = {
      KYCVerification: [
        { type: "uint8", name: "participantType" },
        { type: "address", name: "participant" },
        { type: "bytes32", name: "kyc" },
        { type: "uint256", name: "nonce" }
      ]
    };
    const data = {
      participantType: pType,
      participant: participant,
      kyc: ethers.utils.id(kycHash),
      nonce: ethers.BigNumber.from(nonce)
    };

    toast.info("Waiting for signature..", { position: "top" });

    const signatures = await wallet.getSignature(domain, types, data);
    Promise.all([signatures])
      .then(() => {
        // // console.log(signature[0]);
        // const expectedSignerAddress = context.state.user.wallet.address;
        // const recoveredAddress = ethers.utils.verifyTypedData(domain, types, data, signatures[0]);
        // console.log("Signer Address CHECK______\n", recoveredAddress, "\n", expectedSignerAddress);
        // console.log(recoveredAddress.toLowerCase() === expectedSignerAddress.toLowerCase());
      });
    const signature = signatures[0]
    console.log(signature);
    const status = await dao.approve(data.participantType, data.participant, data.kyc, signature);

    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
      context.dispatch("refreshProposalsDataForAsset", {
        assetId: params.assetId,
      });
      // router.push("/" + DAO + "/" + params.assetId);
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
  },

  async participantsByType(context, params) {
    const type = params.type || 2;
    // await dao.getParticipantsByType(type)
  },
  ...whitelistActions(whitelist),
};

const mutations = {
  setWallet(state, wallet) {
    state.user.wallet = wallet;
  },

  setEthBalance(state, ethBalance) {
    state.user.wallet.ethBalance = ethBalance;
  },

  setAssets(state, assets) {
    state.platform.assets = assets;
  },

  setProposalsForAsset(state, { proposals, assetId }) {
    state.platform.proposals = proposals; // state.platform.proposals.set(assetId, proposals);
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

  setLoadingState(state, isLoading) {
    state.interface.isLoading = isLoading;
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
