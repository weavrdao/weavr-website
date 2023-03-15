/* eslint-disable max-lines-per-function */
import {ethers} from "ethers";
import {createToaster} from "@meforma/vue-toaster";
import {params} from "stylus/lib/utils";
import ServiceProvider from "../services/provider";
import {CONTRACTS, NETWORK} from "../services/constants";

import blacklist from "@/blacklist.json";


const wallet = ServiceProvider.wallet();
const dao = ServiceProvider.dao();

function state() {
  return {
    platform: {
      assets: [],
      quorum: 0,
      proposals: [], // new Map()
    },
  };
}


const getters = {

  allAssets(state) {
    return state.platform.assets;
  },
  quorum(state) {
    return state.platform.quorum;
  },
  assetsById(state) {
    var assetMap = new Map();
    state.platform.assets.forEach((asset) => {
      assetMap.set(asset.id, asset);
    });
    return assetMap;
  },

  proposalsPerAsset(state) {
    return state.platform.proposals
  },

  assetsAddressById(state) {
    var assetMap = new Map();
    state.platform.assets.forEach((asset) => {
      assetMap.set(asset.id, asset.contract);
    });

    return assetMap;
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

};


const actions = {

  async refreshProposalsDataForAsset(context, params) {
    // NOTE (bill) Quick fix to allow loading from child paths, better solutions available
    if (context.getters.assetProposals.length > 1 && !params.forceRefresh)
      return false;
    let assetId = params.assetId.toLowerCase();
    let assetProposals = await dao.getProposalsForAsset(assetId, localStorage);
    console.log(context.getters.assetProposals)
    context.commit("setProposalsForAsset", {
      assetId: assetId.toLowerCase(),
      proposals: assetProposals,
    });
  },

  async createPaperProposal(context, props) {
    const {assetAddr, daoResolution, title, description, forumLink} = props;
    const toast = params.$toast || createToaster({});
    console.log(assetAddr);
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
  
  async createDescriptorChangeProposal(context, props) {
    const {assetAddr, title, description, forumLink, descriptor} = props;
    const toast = params.$toast || createToaster({});
    console.log(assetAddr);
    toast.clear();
    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });

    const status = await dao
      .createDescriptorChangeProposal(assetAddr, title, description, forumLink, descriptor)
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
    const {title, assetId, participantType, participant, description, forumLink} = props;
    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });
    const status = await dao.createParticipantProposal(
      assetId,
      title,
      participantType,
      participant,
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
  async createParticipantRemovalProposal(context, props) {
    const toast = params.$toast || createToaster({});
    const {assetId, participant, removalFee, signatures, title, description, forumLink} = props;
    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });
    const status = await dao.createParticipantRemovalProposal(
      assetId,
      participant,
      removalFee,
      signatures,
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

  async simulateProposalWillComplete(context, props) {
    const {proposalId, endTimestamp } = props;
    return await dao.simulateWillProposalComplete(proposalId, endTimestamp);
  },

  async createThreadProposal(context, props) {
    const toast = params.$toast || createToaster({});

    const {
      assetId,
      blobVersion,
      name,
      descriptor,
      title,
      description,
      metrics,
      forumLink,
      symbol,
      tradeToken,
      funding_target,
      images,
      documents,
    } = props;

    toast.info("Uploading files to IPFS (this may take some time)", {
      duration: 10000,
      position: "bottom",
    });

    const status = dao.createThreadProposal(
      assetId,
      blobVersion,
      name,
      descriptor,
      title,
      description,
      metrics,
      forumLink,
      symbol,
      tradeToken,
      funding_target,
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

    const {assetAddress, proposalId, votes} = props;

    const status = dao.vote(
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

  async withdrawProposal(context, props) {
    const toast = params.$toast || createToaster({});

    const {assetAddress, proposalId} = props;

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
    const id = ethers.BigNumber.from(props.proposalId)
    const status = await dao.queue(id);
    console.log(status)

  },

  async completeProposal(context, props) {
    const id = ethers.BigNumber.from(props.proposalId)
    const DATA = params.data || "0x000000"
    const status = await dao.complete(id, DATA);
    console.log(status)
  },

  async vouchParticipant(context, props) {
    const toast = params.$toast || createToaster({});
    const {customDomain, participant} = props;

    const domain = customDomain || {
      name: "Weavr Protocol",
      version: "1",
      chainId: NETWORK.id,
      verifyingContract: CONTRACTS.WEAVR
    };
    const types = {
      Vouch: [{type: "address", name: "participant"}],
    };
    const data = {
      participant: participant
    };

    toast.info("Waiting for signature..", {position: "top"});

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
    const {customDomain, participant, pType, kycHash, nonce} = props;
    console.log({customDomain, participant, pType, kycHash, nonce})
    const domain = customDomain || {
      name: "Weavr Protocol",
      version: "1",
      chainId: NETWORK.id,
      verifyingContract: CONTRACTS.WEAVR
    };
    const types = {
      KYCVerification: [
        {type: "uint8", name: "participantType"},
        {type: "address", name: "participant"},
        {type: "bytes32", name: "kyc"},
        {type: "uint256", name: "nonce"}
      ]
    };
    const data = {
      participantType: pType,
      participant: participant,
      kyc: ethers.utils.id(kycHash),
      nonce: ethers.BigNumber.from(nonce)
    };

    toast.info("Waiting for signature..", {position: "top"});

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


  async quorum(context, params) {
    console.log("PARAMS: ", params.assetId)
    const assetId = params.assetId;
    const quorum = await dao.quorum(assetId);
    context.commit("setQuorum", ethers.utils.formatUnits(quorum, "ether"))
  }
};

const mutations = {

  setAssets(state, assets) {
    state.platform.assets = assets;
  },

  setProposalsForAsset(state, {proposals}) {
    state.platform.proposals = proposals;
  },

  setThreads(state, assets) {
    state.platform.threads = assets;
  },
  setNeedles(state, needles) {
    state.platform.needles = needles;
  },

  setQuorum(state, quorum) {
    state.platform.quorum = quorum;
  }

};

export default {
  state,
  getters,
  actions,
  mutations,
};
