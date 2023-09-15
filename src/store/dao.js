/* eslint-disable max-lines-per-function */
import { ethers } from "ethers";
import { createToaster } from "@meforma/vue-toaster";
import { params } from "stylus/lib/utils";
import ServiceProvider from "../services/provider";
import { CONTRACTS, NETWORK } from "../services/constants";
import { ProposalTypes } from "@/models/common";
import blacklist from "@/blacklist.json";

function recoverSignerFromTypedData(signature, params, from) {
  console.log("RECOVERY______________", signature, params, from);
  const domainSeparator = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      [
        ethers.utils.id("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
        ethers.utils.id(params.domain.name),
        ethers.utils.id(params.domain.version),
        params.domain.chainId,
        params.domain.verifyingContract,
      ]
    )
  );

  const typeHash = ethers.utils.id("Vouch(address participant)");
  const valueHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "address"],
      [typeHash, params.message.participant]
    )
  );

  const digest = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      ["0x19", "0x01", domainSeparator, valueHash]
    )
  );

  const recoveredAddress = ethers.utils.recoverAddress(digest, signature);
  console.log("Recovered address:", recoveredAddress);
  console.log("Signer address:", from);
  console.log("Addresses match:", recoveredAddress.toLowerCase() === from.toLowerCase());
}

const wallet = ServiceProvider.wallet();
const dao = ServiceProvider.dao();

function state() {
  return {
    platform: {
      assets: [],
      quorum: 0,
      proposals: new Map()
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


  // assetProposals(state) {
  //   return state.platform.proposals.filter((proposal) => {
  //     const isBlacklisted = blacklist.addresses.some((address) => {
  //       return address.toLowerCase() === proposal.creator.toLowerCase();
  //     });
  //     return !isBlacklisted;
  //   });
  // },

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
  async createProposal(context, params) {
    console.log("PROPOSAL CREATION");
    const { pType } = params
    const typeToFunction = `create${pType}Proposal`
    const toast = params.$toast || createToaster({});
    toast.clear();
    toast.show("Confirming transaction...", {
      duration: 15000,
      position: "top",
    });
    const status = await context.dispatch(typeToFunction, params)
    Promise.resolve([status]).then((status) => {
      if (status) {
        toast.success("Transaction confirmed!");
        context.dispatch("refreshProposalsDataForAsset", { assetId: params.assetAddr, forceRefresh: true })
      } else {
        toast.error("Transaction failed. See details in MetaMask.");
        console.log("Transaction failed. See details in MetaMask.");
      }
    });
  },
  async refreshProposalsDataForAsset(context, params) {
    let assetId = params.assetId.toLowerCase();
    if (context.getters.proposalsPerAsset.get(assetId) && !params.forceRefresh)
      return false;

    const { isThread } = params;
    let assetProposals = await dao.getProposalsForAsset(assetId, isThread, localStorage);

    context.commit("setProposalsForAsset", {
      assetId: assetId.toLowerCase(),
      proposals: assetProposals,
    });
  },

  async createPaperProposal(context, props) {
    const { assetAddr, daoResolution, title, description, forumLink } = props;
    return dao.createPaperProposal(assetAddr, title, description, forumLink, daoResolution)
  },

  async createDissolutionProposal(context, props) {
    const { assetAddr, daoResolution, title, description, forumLink, token, purchaseAmount } = props;
    return dao.createDissolutionProposal(assetAddr, title, description, forumLink, daoResolution, token, purchaseAmount)
  },

  async createDescriptorChangeProposal(context, props) {
    const { assetAddr, title, description, forumLink, descriptor, images, documents, metrics } = props;
    return dao.createDescriptorChangeProposal(assetAddr, title, description, forumLink, descriptor, images, documents, metrics)
  },

  async createParticipantProposal(context, props) {
    const { assetId, participant, participantType, title, description, forumLink } = props;
    return dao.createParticipantProposal(
      assetId,
      title,
      participantType,
      participant,
      description,
      forumLink
    );
  },

  async createParticipantRemovalProposal(context, props) {
    const { assetId, participant, removalFee, signatures, title, description, forumLink } = props;
    return dao.createParticipantRemovalProposal(
      assetId,
      participant,
      removalFee,
      signatures,
      title,
      description,
      forumLink
    );
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
      forumLink,
      signer,
      governor,
    } = props;

    return dao.createUpgradeProposal(
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
  },

  async createTokenActionProposal(context, props) {
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
    const tokenAddress = await dao.getTokenAddress(assetId);
    const atomicAmount = ethers.utils.parseEther(String(amount));
    return dao.createTokenActionProposal(
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
  },

  async simulateProposalWillComplete(context, props) {
    const { proposalId, endTimestamp } = props;
    return await dao.simulateWillProposalComplete(proposalId, endTimestamp);
  },

  async createThreadProposal(context, props) {
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
    return dao.createThreadProposal(
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
  },

  async vote(context, props) {
    const toast = params.$toast || createToaster({});
    const { assetAddress, proposalId, votes } = props;
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
      return true;
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
    console.log(status);
  },

  async withdrawProposal(context, props) {
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
      return true;
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
    }
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

  async vouchParticipant(context, params) {
    const toast = params.$toast || createToaster({});
    const { participant } = params;
    const domain = {
      name: "Weavr Protocol",
      version: "1",
      chainId: NETWORK.id,
      verifyingContract: CONTRACTS.WEAVR
    };
    const types = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Vouch: [{ type: "address", name: "participant" }],
    };
    const message = {
      participant: participant
    };
    const _params = {
      domain: domain,
      types: types,
      primaryType: "Vouch",
      message: message
    }
    toast.info("Waiting for signature..", { position: "top" });
    let fixedSignature = {}
    const signature = await wallet.getSignature(_params).then((signatures) => {
      const sig = ethers.utils.splitSignature(signatures[0]);
      const fixedV = sig.v + (2 * _params.domain.chainId) + 36;
      fixedSignature = {
        ...sig,
        v: fixedV,
      };
      return signatures[0]
    });
    const status = await dao.vouch(participant, ethers.utils.joinSignature(fixedSignature));
    if (status) {
      toast.success("Transaction confirmed...", {
        duration: 2000,
        position: "top",
      });
      return true
    } else {
      toast.error("Transaction failed. See details in MetaMask.");
      console.log("Transaction failed. See details in MetaMask.");
      return false
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

  setProposalsForAsset(state, { assetId, proposals }) {
    state.platform.proposals.set(assetId, proposals);
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
