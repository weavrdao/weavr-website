import ServiceProvider from "../services/provider"
import WalletState from "../models/walletState"
// import { MarketOrderType } from "../models/marketOrder"
import { bigIntMax, bigIntMin } from "../utils/common"
import router from "../router/index"
import { Vote } from "../models/vote"
import { CommonProposalType, FrabricProposalType, ThreadProposalType } from "@/models/common.js"

const wallet = ServiceProvider.wallet()
const market = ServiceProvider.market()
const dao = ServiceProvider.dao()

function state() {
  return {
    user: {
      wallet: WalletState
    },
    platform: {
      assets: [],
      proposals: new Map()
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
    var proposalsMap = new Map()

    console.log(state.platform.proposals.values())

    Array.from(state.platform.proposals.values())
      .flatMap(p => { return p })
      .forEach(p => { proposalsMap.set(p.id, p) })

    console.log(proposalsMap);
    return proposalsMap
  },

  activeAlert(state) {
    return state.interface.alert
  }
}

const actions = {
  async syncWallet(context) {
    const walletState = await wallet.getState()
    context.commit("setWallet", walletState)
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
    // context.dispatch("refreshMarketplaceData")

    let assetId = params.assetId.toLowerCase();
    console.log(assetId);

    let assetProposals = await dao.getProposalsForAsset(assetId)

    console.log("New Proposals")
    console.log(assetProposals)

    context.commit("setProposalsForAsset", { assetId: assetId, proposals: assetProposals })
  },
  /*
    AT THE MOMENT THIS IS USING THE ID, BUT WE NEED TO PASS THE ADDRESS TO THE FUNCTION
    SUGGESTION: GET THE ADDRESS FROM ID IN THE COMPONENT-SPECIFIC PROPOSAL
  */
  async createPaperProposal(context, props) {
    let { assetAddr, proposalType, title, description } = props
    console.log("assetAddr: ", assetAddr, props);
    // params.$toast.show("Confirming transaction...", {
    //   duration: false
    // });
    // const x = await dao.vote("0", "0", "Yes");

    const status = await dao.createPaperProposal(assetAddr, title, description);

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
    } = props;

    const status = await dao.createUpgradeProposal(
      assetAddress,
      beaconAddress,
      instanceAddress,
      codeAddress,
      title,
      description,
      version,
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
    } = props;

    const status = await dao.createTokenActionProposal(
      tokenAddress,
      targetAddress,
      mint,
      price,
      amount,
      title,
      description,
    );

    console.log(status);
  },

  async voteOnProposal(context, params) {
    let asset = context.getters.assetsById.get(params.assetId)
    let proposal = context.getters.proposalsById.get(params.proposalId)
    let voteType = params.voteType

    params.$toast.show("Confirming transaction...", {
      duration: false
    })

    const status = await dao.vote(asset, proposal, voteType);
    params.$toast.clear();

    if (status) {
      params.$toast.success("Transaction confirmed!");
      context.dispatch("refreshProposalsDataForAsset", { assetId: params.assetId })
    } else {
      params.$toast.error("Transaction failed. See details in MetaMask.");
    }
  },

  async vouchParticipant(context, props) {
    let { assetAddr, participant } = props
    console.log("assetAddr: ", assetAddr, props);
    const status = await dao.vouch(
      assetAddr,
      {
        name: "Frabric Protocol",
        version: "2",
        chainId: 4,
      },
      participant)
    // async vouch(params) {
    //   console.log("PARAMS: ", params);
    //   const domain = {
    //     name: 'Frabric Protocol',
    //     version: '1',
    //     chainId: 4,
    //   }
    //   // const status = await this.dao.vouch(contractAddress, domain, "0x4C3D84E96EB3c7dEB30e136f5150f0D4b58C7bdB")
    //   console.log("STATE: ", status);  
    // },
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
    state.platform.proposals.set(assetId, proposals)
  },

  setAlert(state, alert) {
    state.interface.alert = alert
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
