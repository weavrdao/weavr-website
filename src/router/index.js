import { createRouter, createWebHashHistory } from 'vue-router';
import PageNotFound from "@/components/pages/404.vue";
import Modal from "@/components/views/modal/Modal.vue"
import Homepage from "@/components/pages/Homepage.vue"
import newPaperProposal from "@/components/proposals/newPaperProposal.vue"
import newParticipantProposal from "@/components/proposals/newParticipantProposal.vue";
import newUpgradeProposal from "@/components/proposals/newUpgradeProposal.vue";
import newTokenAction from "@/components/proposals/newTokenAction.vue";
import newThreadProposal from "@/components/proposals/newThreadProposal.vue";
import SingleProposal from "@/components/proposals/SingleProposal.vue";
import vouch from "@/components/proposals/vouch"
import tokenDetails from "@/components/sections/TokenDetails.vue"
import walletConnect from "@/components/sections/WalletConnect.vue"
import { WhitelistPage } from "../whitelist";
import {CONTRACTS, DAO} from "../services/constants"
import { createToaster } from '@meforma/vue-toaster';
import store from '../store';
import { ethers } from "ethers";

const router = new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/whitelist",
    },
    {
      path: "/whitelist",
      component: WhitelistPage,
    },
    {
      path: "/walletConnect",
      component: Modal,
      props: {component: walletConnect}
    },
    {
      path: "/".concat(DAO).concat("/:assetId"),
      alias: "/".concat(DAO),
      component: Homepage,
      props: { assetId:  CONTRACTS.WEAVR},
      children: [
        {
          path: "tokenInfo",
          component: Modal,
          props: {assetId: "", component: tokenDetails}
        },
        {
          path: "paperProposal",
          component: Modal,
          props: { assetId: "", component: newPaperProposal }
        },
        {
          path: "participantProposal",
          component: Modal,
          props: { assetId: "", component: newParticipantProposal }
        },
        {
          path: "upgradeProposal",
          component: Modal,
          props: { assetId: "", component: newUpgradeProposal }
        },
        {
          path: "tokenProposal",
          component: Modal,
          props: { assetId: "", component: newTokenAction },
        },
        {
          path: "vouch",
          component: Modal,
          props: { assetId: "", component: vouch }
        },
        {
          path: "threadProposal",
          component: Modal,
          props: { assetId: "", component: newThreadProposal },
        },
        {
          path: "proposal/:proposalId",
          component: Modal,
          props: { assetId: "", component: SingleProposal },
          beforeEnter: async (to, from) => { 
            const prop = await store.getters.proposalsPerAsset
            if(!prop){
              store.dispatch("refreshProposalsDataForAsset", {assetId: CONTRACTS.WEAVR })      
            }            
            // clear toast
            return true
          },
        }
      ]
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound },
  ],
});

let originalPath = "";
let hasOriginalPathBeenSet = false;
let hasRedirectedAfterWhitelisting = false;

router.beforeEach((to, from) => {
  if(!hasOriginalPathBeenSet) {
    originalPath = to.fullPath;
    hasOriginalPathBeenSet = true;
    console.log(originalPath);
  }

  if(to.fullPath === "/whitelist") {
    return true;
  }

  if(to.fullPath === "/walletConnect") {
    return true;
  }
  const address = store.getters.userWalletAddress;
  const isConnected = ethers.utils.isAddress(address);
  if(!isConnected) {
    router.push("/");
  }
  const whitelisted = store.getters.isWhitelisted;
  if(whitelisted) {
    if(!hasRedirectedAfterWhitelisting) {
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
