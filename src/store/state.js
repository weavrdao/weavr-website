import ServiceProvider from "../services/provider"
import WalletState from "../models/walletState"
// import { MarketOrderType } from "../models/marketOrder"
import { bigIntMax, bigIntMin } from "../utils/common"
import router from "../router/index"
import { ethers } from "ethers";
import { Vote } from "../models/vote"
import { CommonProposalType, FrabricProposalType, ThreadProposalType } from "@/models/common.js"
import { CONTRACTS } from "../services/constants"


const wallet = ServiceProvider.wallet()
const market = ServiceProvider.market()
const dao = ServiceProvider.dao()
const token = ServiceProvider.token();

function state() {
  return {
    user: {
      wallet: WalletState,
      vouches: []
    },
    platform: {
      assets: [],
      proposals: [] // new Map()
    },
    interface: {
      alert: null
    }
  }
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
  userWalletAddress(state) {
    return state.user.wallet.address
  },

  userTokenBalance(state) {
    return state.user.wallet.tokenBalance;
  },

  assetTokenSymbol(state) {
    return state.user.wallet.tokenSymbol
  },

  userEthBalance(state) {
    return state.user.wallet.ethBalance
  },
  
  allAssets(state) {
    return state.platform.assets
  },

  assetsById(state) {
    var assetMap = new Map()
    state.platform.assets
      .forEach(asset => {
        assetMap.set(asset.id, asset)
      })

    return assetMap
  },

  assetsAddressById(state) {
    var assetMap = new Map()
    state.platform.assets
      .forEach(asset => {
        assetMap.set(asset.id, asset.contract)
      })

    return assetMap
  },

  marketplaceActiveAssets(state) {
    return state.platform.assets
  },

  ownedAssets(state) {
    return state.platform.assets
      .filter(asset => { return asset.owners.get(state.user.wallet.address) })
  },

  vouchesPerSigner(state) {
    let signer = state.user.wallet.address

    
    
    return state.user.wallet.vouches
  },

  // TODO: Quick implementation for testing, need something smarter than that
  // bestAssetPrices(state) {
  //   var assetPriceMap = new Map()

  //   state.platform.assets
  //     .forEach(asset => {
  //       let buyPrices = asset.marketOrders
  //         .filter(o => { return o.orderType == MarketOrderType.Buy })
  //         .map(o => { return o.price })
  //       let sellPrices = asset.marketOrders
  //         .filter(o => { return o.orderType == MarketOrderType.Sell })
  //         .map(o => { return o.price })

  //       const prices = {
  //         bid: bigIntMax(buyPrices),
  //         ask: bigIntMin(sellPrices)
  //       }

  //       assetPriceMap.set(asset.id, prices)
  //     })

  //   console.log("Best asset prices:")
  //   console.log(assetPriceMap)

  //   return assetPriceMap
  // },

  assetProposals(state) {
    return state.platform.proposals
  },

  proposalsById(state) {
    const proposalsMap = new Map()
    Array.from(state.platform.proposals.values())
      .flatMap(p => { return p })
      .forEach(p => { proposalsMap.set(p.id, p) })

    return proposalsMap
  },

  activeAlert(state) {
    return state.interface.alert
  }
}

const actions = {
  async syncWallet(context) {
    let walletState = await wallet.getState();
    console.log(walletState);

    const symbol = await token.getTokenSymbol(CONTRACTS.FRBC);
    const balance = await token.getTokenBalance(CONTRACTS.FRBC, walletState.address);
  
    
    walletState = new WalletState(walletState.address, walletState.ethBalance, ethers.utils.formatEther(balance).toString() , symbol);
    context.commit("setWallet", walletState);
    console.log(await wallet.getState())

  },

  // TODO (bill) This needs to be reimplemented
  async refreshOwnedAssetsData(context) {
    // let assets = await market.getAssetsOnTheMarket()
    // context.commit("setAssets", assets)
  },

  // TODO (bill) This needs to be reimplemented
  async refreshMarketplaceData(context) {
    // let assets = await market.getAssetsOnTheMarket()
    // context.commit("setAssets", assets)
  },

  async swapToAsset(context, params) {
    const asset = params.asset
    const amount = params.amount

    const price = context.getters.bestAssetPrices.get(asset.id).ask
    params.$toast.info("Confirming transaction...", {
      duration: false
    });

    const status = await market.buy(asset, amount, price);
    params.$toast.clear();
    console.log(params, params?.$toast);

    if (status) {
      params.$toast.success("Transaction confirmed!");
    } else {
      params.$toast.error("Transaction failed. See details in MetaMask.");
    }
  },

  async refreshProposalsDataForAsset(context, params) {
    // NOTE (bill) Quick fix to allow loading from child paths, better solutions available
    if (context.getters.assetProposals.length > 1) return;

    let assetId = params.assetId.toLowerCase();
    let assetProposals = await dao.getProposalsForAsset(assetId)

    context.commit("setProposalsForAsset", { assetId: assetId.toLowerCase(), proposals: assetProposals })
  },

  /*
    AT THE MOMENT THIS IS USING THE ID, BUT WE NEED TO PASS THE ADDRESS TO THE FUNCTION
    SUGGESTION: GET THE ADDRESS FROM ID IN THE COMPONENT-SPECIFIC PROPOSAL
  */
  async createPaperProposal(context, props) {
    let { assetAddr, daoResolution, title, description } = props
    console.log("assetAddr: ", assetAddr, props);
    props.$toast.info("Confirming transaction...", {
      duration: false
    });

    const status = await dao.createPaperProposal(assetAddr, title, description, daoResolution).then(
      () => {
        props.$toast.clear();
      }
    );
    Promise.resolve([status]).then(
      status => {
        if (status) {
          props.$toast.success("Transaction confirmed!");
        } else {
          props.$toast.error("Transaction failed. See details in MetaMask.");
          console.log("Transaction failed. See details in MetaMask.")
        }
      }

    )
    
    
    
    
  },

  async createParticipantProposal(context, props) {
    let { assetId, participantType, participant, info } = props

    console.log(props)
    console.log('OBJ: \t', participantType, participant, info);

    console.log("STATE 1", " ", assetId);
    const status = await dao.createParticipantProposal(assetId, participantType, participant, info);
    console.log(status);
    // params.$toast.clear();

    // if (status) {
    //   params.$toast.success("Transaction confirmed!");
    //   context.dispatch("refreshProposalsDataForAsset", { assetId: params.assetId })
    //   router.push("/dao/" + params.assetId + "/proposals")
    // } else {
    //   params.$toast.error("Transaction failed. See details in MetaMask.");
    //   console.log("Transaction failed. See details in MetaMask.")
    // }
  },

  async createUpgradeProposal(context, props) {
    const {
      assetAddress,
      beaconAddress,
      instanceAddress,
      version,
      codeAddress,
      title,
      description,
      signer,
      governor
    } = props;
    
    
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
    )

    console.log(status);
  },

  async createTokenActionProposal(context, props) {
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

    console.dir(props);

    const status = await dao.createTokenActionProposal(
      tokenAddress,
      targetAddress,
      mint,
      price,
      amount,
      title,
      description,
      tradeToken,
      target,
    );

    console.log(status);
    return status;
  },

  async createThreadProposal(context, props) {
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
      name, descriptor,
      title,
      description,
      symbol,
      tradeToken,
      target,
    );

    console.log(status)
    return status;
  },

  async vote(context, props) {
    const {
      assetAddress,
      proposalId,
      votes,
    } = props;

    const status = await dao.vote(
      assetAddress || CONTRACTS.WEAVR,
      proposalId,
      votes,
    );

    console.log(status);
  },

  async vouchParticipant(context, props) {
    let { assetAddr, participant } = props
    console.log("assetAddr: ", assetAddr, participant);

    const domain = {
      name: "Protocol",
      version: "1",
      chainId: 42161,
      verifyingContract: CONTRACTS.WEAVR
    }
    const types = {
      Vouch: [
          {type: "address", name: "participant"}
      ]
    }
    const data = {participant: participant}
    const signature = await wallet.getSignature(domain, types, data)
    Promise.all([signature]).then( () => {
      console.log(signature[0])
    });    
    const tx = await dao.vouch(participant, signature[0])
    console.log(tx.hash)
  }
}

const mutations = {
  setWallet(state, wallet) {
    state.user.wallet = wallet
  },

  setEthBalance(state, ethBalance) {
    state.user.wallet.ethBalance = ethBalance
  },

  setAssets(state, assets) {
    state.platform.assets = assets
  },

  setProposalsForAsset(state, { proposals, assetId }) {
    state.platform.proposals = proposals; // state.platform.proposals.set(assetId, proposals);
  },

  setAlert(state, alert) {
    state.interface.alert = alert
  },

  setTokenBalance(state, balance) {
    state.user.wallet.tokenBalance = balance;
  },

  setTokenSymbol(state, symbol) {
    state.user.wallet.tokenSymbol = symbol;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
