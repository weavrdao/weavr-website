import {createRouter, createWebHashHistory} from "vue-router";
import PageNotFound from "@/components/pages/404.vue";
import Modal from "@/components/views/modal/Modal.vue";
import Governance from "@/components/pages/Governance.vue";
import NeedlesMarketplace from "@/components/sections/Needles/NeedleMarketplace.vue";
import SingleNeedle from "@/components/sections/Needles/SingleNeedle.vue";
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
import {WhitelistPage} from "@/whitelist";
import {CONTRACTS, DAO} from "@/services/constants";
import store from "@/store";
import ComingSoon from "@/components/sections/ComingSoon/ComingSoon.vue";
import SingleComingSoonPage from "@/components/sections/ComingSoon/SingleComingSoonPage.vue";
import {ethers} from "ethers";
import SumSub from "@/components/SumSub.vue";
import { getCookie } from "../whitelist";
import { USER_COOKIE_KEY } from "../whitelist/constants";

const router = new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/whitelist",
    },
    {
      path: "/whitelist",
      name: "whitelist",
      component: WhitelistPage,
    },
    {
      path: "/walletConnect",
      name: "wallet-connect",
      component: Modal,
      props: {component: walletConnect},
    },
    {
      path: "/governance",
      name: "governance",
      redirect: "governance"
    },
    {
      path: '/gov',
      beforeEnter() {location.href = 'https://gov.weavr.org'}
    },
    {
      path: "/marketplace",
      name: "marketplace",
      redirect: "/marketplace/coming-soon",
    },
    {
      path: "/marketplace/needles",
      name: "needle-market",
      component: NeedlesMarketplace,
    },
    {
      path: "/needle/:needleId",
      name: "needle",
      component: SingleNeedle,
    },
    {
      path: "/marketplace/coming-soon",
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
      name: "governance",
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
    originalPath = to.fullPath === "/whitelist" ? "/weavr" : to.fullPath;
    hasOriginalPathBeenSet = true;
  }

  if (to.fullPath === "/whitelist") {
    return true;
  }

  if (to.fullPath === "/walletConnect") {
    return true;
  }

  // Should check for cookie or wallet connected
  const address = getCookie(USER_COOKIE_KEY) || store.getters.userWalletAddress;
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
    router.push("/whitelist");
  }

  return true;
});

export default router;