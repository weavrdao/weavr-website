import router from "../router/index";
import { ethers } from "ethers";
import { createToaster } from "@meforma/vue-toaster";
import { params } from "stylus/lib/utils";
import ServiceProvider from "../services/provider";
import WalletState from "../models/walletState";
import { CONTRACTS, DAO } from "../services/constants";
import {
  whitelistState,
  whitelistGetters,
  whitelistActions,
  whitelistMutations,
} from "../whitelist";
const {
  getMetaMaskProvider,
  getCoinbaseWalletProvider,
  getBraveProvider,
} = require("../data/network/web3/ethereum/providers.js");

/**
 * TODO - Abstrucked -
 *  ;Implement clickable toast to link to chain explorer to review the tx
 */

const wallet = ServiceProvider.wallet();
const dao = ServiceProvider.dao();
const token = ServiceProvider.token();
const whitelist = ServiceProvider.whitelist();

function state() {
  return {
    user: {
      wallet: WalletState,
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
  userWalletAddress(state) {
    return state.user.wallet.address;
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
    return state.platform.proposals;
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
  async fetchTokenInfo(context, params) {
    // const toast = params.$toast || createToaster({});
    const tokenAddress = params.tokenAddress || CONTRACTS.FRBC;
    const supply = await token.getTotalSupply(tokenAddress);
    console.log(ethers.utils.formatEther(supply));
    return {
      totalSupply: ethers.utils.formatEther(supply),
    };
  },
  async connectWallet(context, params) {
    console.log("into connectwallet: ", params.wallet);
    let provider, walletState;

    const symbol = await token.getTokenSymbol(CONTRACTS.FRBC);
    const balance = await token.getTokenBalance(
      CONTRACTS.FRBC,
      walletState.address
    );
    Promise.all([symbol, balance]).then((res) => {
      console.log(res);
    });
    walletState = new WalletState(
      walletState.address,
      walletState.ethBalance,
      ethers.utils.formatEther(balance).toString(),
      symbol
    );
    context.commit("setWallet", walletState);
  },

  async syncWallet(context, params) {
    console.log("SYNC");
    let { $toast } = params;
    // const toast = createToaster({});
    let walletState = await wallet.getState(params.wallet);
    const symbol = await token.getTokenSymbol(CONTRACTS.FRBC);
    const balance = await token.getTokenBalance(
      CONTRACTS.FRBC,
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

    walletState = new WalletState(
      walletState.address,
      walletState.ethBalance,
      ethers.utils.formatEther(balance).toString(),
      symbol
    );

    context.commit("setWallet", walletState);
    console.log(await wallet.getState());
    $toast.clear();
    $toast.success("Wallet fully synced", {
      duration: 1000,
      position: "top",
    });
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
    const { assetAddr, daoResolution, title, description } = props;
    const toast = params.$toast || createToaster({});

    toast.clear();
    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });

    const status = await dao
      .createPaperProposal(assetAddr, title, description, daoResolution)
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
    const { assetId, participantType, participant, info } = props;

    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });
    const status = await dao.createParticipantProposal(
      assetId,
      participantType,
      participant,
      info
    );
    toast.clear();
    if (status) {
      toast.success("Transaction confirmed!");
      context.dispatch("refreshProposalsDataForAsset", {
        assetId: params.assetId,
      });
      router.push("/" + DAO + "/" + params.assetId);
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
      router.push("/" + DAO + "/" + params.assetId);
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
  },

  async createTokenActionProposal(context, props) {
    const toast = params.$toast || createToaster({});

    const {
      tokenAddress,
      targetAddress,
      mint,
      price,
      amount,
      title,
      description,
      tradeToken,
      target,
    } = props;

    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });

    const status = await dao.createTokenActionProposal(
      tokenAddress,
      targetAddress,
      mint,
      price,
      amount,
      title,
      description,
      tradeToken,
      target
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
      router.push("/" + DAO + "/" + params.assetId);
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
      symbol,
      tradeToken,
      target,
    } = props;

    const status = await dao.createThreadProposal(
      assetId,
      name,
      descriptor,
      title,
      description,
      symbol,
      tradeToken,
      target
    );
    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
      context.dispatch("refreshProposalsDataForAsset", {
        assetId: params.assetId,
      });
      router.push("/" + DAO + "/" + params.assetId);
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
      router.push("/" + DAO + "/" + params.assetId);
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
    console.log(status);
  },

  async vouchParticipant(context, props) {
    const toast = params.$toast || createToaster({});
    const { customDomain, participant } = props;
    const networks = {
      goerli: 5,
      arbitrum: 42161,
    };
    const domain = customDomain || {
      name: "Protocol",
      version: "1",
      chainId: networks.arbitrum,
      verifyingContract: CONTRACTS.WEAVR,
    };
    const types = {
      Vouch: [{ type: "address", name: "participant" }],
    };
    const data = { participant: participant };
    toast.info("Waiting for signature..", { position: "top" });
    const signature = await wallet.getSignature(domain, types, data);
    Promise.all([signature]).then(() => {
      console.log(signature[0]);
    });
    const status = await dao.vouch(participant, signature[0]);
    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
      context.dispatch("refreshProposalsDataForAsset", {
        assetId: params.assetId,
      });
      router.push("/" + DAO + "/" + params.assetId);
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
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
