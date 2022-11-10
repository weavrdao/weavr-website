import {createRouter, createWebHashHistory} from "vue-router";
import PageNotFound from "@/components/pages/404.vue";
import Modal from "@/components/views/modal/Modal.vue";
import Governance from "@/components/pages/Governance.vue";
import newPaperProposal from "@/components/proposals/newPaperProposal.vue";
import newParticipantProposal from "@/components/proposals/newParticipantProposal.vue";
import newUpgradeProposal from "@/components/proposals/newUpgradeProposal.vue";
import newTokenAction from "@/components/proposals/newTokenAction.vue";
import newThreadProposal from "@/components/proposals/newThreadProposal.vue";
import SingleProposal from "@/components/proposals/SingleProposal.vue";
import Vouch from "@/components/proposals/Vouch";
import Queue from "@/components/proposals/Queue"
import Complete from "@/components/proposals/Complete"
import VerifyParticipant from "@/components/proposals/VerifyParticipant";
import tokenDetails from "@/components/sections/TokenDetails.vue";
import walletConnect from "@/components/sections/WalletConnect.vue";
import {WhitelistPage} from "../whitelist";
import {CONTRACTS, DAO} from "../services/constants";
import store from "../store";
import {ethers} from "ethers";
import SumSub from "@/components/SumSub.vue";

const router = new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/auth",
    },
    {
      path: "/auth",
      component: WhitelistPage,
    },
    {
      path: "/walletConnect",
      component: Modal,
      props: {component: walletConnect},
    },
    {
      path: "/marketplace/needle-market",
      name: "needle-market",
      component: NeedlesMarketplace,
    },
    {
      path: "/needle/:needleId",
      name: "needle",
      component: SingleNeedle,
    },
    {
      path: "/coming-soon",
      name: "comingSoon",
      component: ComingSoon,
    },
    {
      path: "/coming-soon/:comingSoonId",
      name: "singleComingSoon",
      component: SingleComingSoonPage,
    },
    {
      path: "/".concat(DAO).concat("/:assetId"),
      alias: "/".concat(DAO),
      component: Governance,
      props: {assetId: CONTRACTS.WEAVR},
      children: [
        {
          path: "kyc",
          component: Modal,
          props: {assetId: "", component: SumSub}
        },
        {
          path: "tokenInfo",
          component: Modal,
          props: {assetId: "", component: tokenDetails},
        },

        {
          path: "paperProposal",
          component: Modal,
          props: {assetId: "", component: newPaperProposal},
        },
        {
          path: "participantProposal",
          component: Modal,
          props: {assetId: "", component: newParticipantProposal},
        },
        {
          path: "upgradeProposal",
          component: Modal,
          props: {assetId: "", component: newUpgradeProposal},
        },
        {
          path: "tokenProposal",
          component: Modal,
          props: {assetId: "", component: newTokenAction},
        },
        {
          path: "vouch",
          component: Modal,
          props: {assetId: "", component: Vouch},
        },
        {
          path: "verify",
          component: Modal,
          props: {assetId: "", component: VerifyParticipant},
        },
        {
          path: "threadProposal",
          component: Modal,
          props: {assetId: "", component: newThreadProposal},
        },
        {
          path: "proposal/:proposalId",
          component: Modal,
          props: {assetId: "", component: SingleProposal},
          beforeEnter: async (to, from) => {
            const prop = await store.getters.proposalsPerAsset;
            if (!prop) {
              store.dispatch("refreshProposalsDataForAsset", {
                assetId: CONTRACTS.WEAVR,
              });
            }
            // clear toast
            return true;
          }
        },
        {
          path: "proposal/:proposalId/queue",
          component: Modal,
          props: {assetId: "", component: Queue}
        },
        {
          path: "proposal/:proposalId/complete",
          component: Modal,
          props: {assetId: "", component: Complete}
        }
      ]
    },
    {path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound},
  ],
});

let originalPath = "";
let hasOriginalPathBeenSet = false;
let hasRedirectedAfterWhitelisting = false;

router.beforeEach((to, from) => {
  if (!hasOriginalPathBeenSet) {
    originalPath = to.fullPath === "/auth" ? "/weavr" : to.fullPath;
    hasOriginalPathBeenSet = true;
  }

  if(to.fullPath.includes("coming-soon")) {
    return true;
  }

  if (to.fullPath === "/auth") {
    return true;
  }

  if (to.fullPath === "/walletConnect") {
    return true;
  }
  const address = store.getters.userWalletAddress;
  const isConnected = ethers.utils.isAddress(address);
  if (!isConnected) {
    router.push("/");
  }
  const whitelisted = store.getters.isWhitelisted;
  if (whitelisted) {
    if (!hasRedirectedAfterWhitelisting) {
      router.push(originalPath);
      hasRedirectedAfterWhitelisting = true;
    }
    return true;
  } else {
    router.push("/auth");
  }

  return true;
});

export default router;
