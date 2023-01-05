/* eslint-disable max-lines-per-function */
import {createRouter, createWebHashHistory, createWebHistory, useRoute} from "vue-router";
import PageNotFound from "@/components/pages/404.vue";
import Modal from "@/components/views/modal/Modal.vue";
import Homepage from "@/components/pages/Homepage.vue"
import PrivacyPage from "@/components/pages/PrivacyPage.vue"
import TermsPage from "@/components/pages/TermsPage.vue"
import Governance from "@/components/pages/Governance.vue";
import Marketplace from "@/components/pages/Marketplace"
import NeedlesMarketplace from "@/components/sections/Needles/NeedleMarketplace.vue";
import SingleNeedle from "@/components/sections/Needles/SingleNeedle.vue";
import ThreadsMarketplace from "@/components/sections/Threads/ThreadMarketplace.vue";
import SingleThread from "@/components/sections/Threads/SingleThread.vue";
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
import { CONTRACTS } from "@/services/constants";
import store from "@/store";
import ComingSoon from "@/components/sections/ComingSoon/ComingSoon.vue";
import SingleComingSoonPage from "@/components/sections/ComingSoon/SingleComingSoonPage.vue";
import { ethers } from "ethers";
import SumSub from "@/components/SumSub.vue";
import { getCookie } from "../whitelist";
import { USER_COOKIE_KEY } from "../whitelist/constants";

import Login from "@/components/sections/Login.vue"
import { GUEST } from "../services/constants";
import { createToaster } from "@meforma/vue-toaster";




const router = new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      component: Homepage
    },
    {
      path: "/toc",
      component: Modal,
      props: { component: TermsPage}
    },
    {
      path: "/privacy",
      component: Modal,
      props: { component: PrivacyPage }
    },
    {
      path: "/resolutions",
      beforeEnter(){
        window.open("https://resolutions.weavr.org", "_blanc")
      }
    },
    {
      path: "/faq",
      beforeEnter(){
        window.open("https://weavr-dao.gitbook.io/weavr-dao/faq/the-basics", "_blanc")
        
      }
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
      path: "/login",
      name: "login",
      component: Modal,
      props: {component: Login}
    },
    {
      path: "/marketplace",
      name: "marketplace",
      alisa: "marketplace",
      component: Marketplace,
      children: [
        {
          path: "needles",
          name: "needle-market",
          component: NeedlesMarketplace,
          meta: {requiresAuth: true}, 
          beforeEnter: async (to, from ) => {
            
            store.dispatch("setLoadingState", {isLoading: true, message: "Loading Needles"})
            
            await store.dispatch("refreshNeedles")
            
            store.dispatch("setLoadingState", {isLoading: false, message: ""})
            
            return true
          }
        },
        {
          path: "needles/:needleId",
          name: "needle",
          component: SingleNeedle,
          beforeEnter: async (to, from ) => {
            
            store.dispatch("setLoadingState", {isLoading: true, message: `Loading data for \n ${"Needle"}`})
            
            await store.dispatch("refreshNeedles")
            
            store.dispatch("setLoadingState", {isLoading: false, message: ""})
            
            return true
          }
        },
        {
          path: "threads",
          name: "thread-market",
          component: ThreadsMarketplace,
          meta: {requiresAuth: true}, 
          beforeEnter: async (to, from ) => {
            
            store.dispatch("setLoadingState", {isLoading: true, message: "Loading Threads"})
            
            await store.dispatch("refreshThreads")
            
            store.dispatch("setLoadingState", {isLoading: false, message: ""})
            
            return true
          }
        },
        {
          path: "threads/:threadId",
          name: "thread",
          component: SingleThread,
          beforeEnter: async (to, from ) => {
            
            store.dispatch("setLoadingState", {isLoading: true, message: "Loading Threads"})
            
            await store.dispatch("refreshThreads")
            
            store.dispatch("setLoadingState", {isLoading: false, message: ""})
            
            return true
          }
        },
        {
          path: "coming-soon",
          name: "comingSoon",
          component: ComingSoon,
          meta: { requiresAuth: false}
        },
        {
          path: "coming-soon/:comingSoonId",
          name: "singleComingSoon",
          component: SingleComingSoonPage,
        },
      ]
    },  
    {
      path: `/dao/:assetId`,
      component: Governance,
      meta: { requiresAuth: true },
      beforeEnter: async (to, from) => {
        const prop = await store.getters.proposalsPerAsset;
        if (!prop) {
          store.dispatch("setLoadingState", {isLoading: true, message: "Loading Proposals"})
          await store.dispatch("refreshProposalsDataForAsset", {
            assetId: CONTRACTS.WEAVR,
          });
          store.dispatch("setLoadingState", {isLoading: false, message: ""})
        }
        // clear toast
        return true;
      },
      children: [
        {
          path: `${CONTRACTS.WEAVR}`,
          name: "weavr",
        },
        {
          path: "kyc",
          component: Modal,
          props: { component: SumSub }
        },
        {
          path: "tokenInfo",
          component: Modal,
          props: { component: tokenDetails },
        },
        {
          path: "paperProposal",
          component: Modal,
          props: { component: newPaperProposal },
        },
        {
          path: "participantProposal",
          component: Modal,
          props: { component: newParticipantProposal },
        },
        {
          path: "upgradeProposal",
          component: Modal,
          props: { component: newUpgradeProposal },
          meta: { locked: true}
        },
        {
          path: "tokenProposal",
          component: Modal,
          props: { component: newTokenAction },
        },
        {
          path: "vouch",
          component: Modal,
          props: { component: Vouch },
        },
        {
          path: "verify",
          component: Modal,
          props: { component: VerifyParticipant },
        },
        {
          path: "threadProposal",
          component: Modal,
          props: { component: newThreadProposal },
        },
        {
          path: "proposal/:proposalId",
          component: Modal,
          props: { component: SingleProposal },
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

router.beforeEach(async (to, from) => {
  /**
   * NOTES
   * Should authorize navigation if:
   * ( isConnected + isWhitelisted || isConnected + isGuest )
   * 
   * ON not connected and COOKIE should AUTOCONNECT
   * ON not connected and NO_COOKIE should send to whitelist to choose how to connect
   * ON not
   */
  console.log("HAS_REDIRECTED___", hasRedirectedAfterWhitelisting);

  const address = store.getters.userWalletAddress;
  const isConnected = ethers.utils.isAddress(address);
  const isWhitelisted = store.getters.isWhitelisted;
  const isGuest = store.getters.guestCookie;
  const decoded_cookie = getCookie(USER_COOKIE_KEY)
  let cookie = {}
  if(decoded_cookie) {
    console.log("COOKIE IS SET___, ", decoded_cookie);
    cookie.wallet = decoded_cookie.split("_")[0]
    cookie.provider = decoded_cookie.split("_")[1]
  }
  // require auth
  if( to.meta.locked ) {
    const toast = createToaster({});
    toast.error("The route you are trying to access is currently locked", { position: "top"});
    return false
  }
  // if( !to.meta.requiresAuth ) {
  //   console.log("NO AUTH AT THE TOP");
  //   return true
  // }
  if( to.meta.requiresAuth ) {
    console.log("META_AUTH_ TRUE");
    console.log(
      {
        isWhitelisted,
        address,
        isConnected,
        decoded_cookie,
        cookie
      }
    );
    // not connected
    if( !isConnected ) {
      // cookie
      if( ethers.utils.isAddress(cookie.wallet) ) {
        if( cookie.wallet === GUEST ) {
          console.log("IS GUEST");
          return true
        }
        // - autoconnect and navigate
        console.log("autoconnect and navigate");
        const toast = createToaster({})
        await store.dispatch("syncWallet", { wallet: cookie.provider, $toast: toast})
        await store.dispatch("checkWhitelistStatus", {assetId: CONTRACTS.WEAVR}).then( () => {
          if( !isWhitelisted ) {
            // not whitelisted
            console.log("not whitelisted");
            return { path: "/whitelist" }
          }
          else if ( isWhitelisted ) {
            // whitelisted
            console.log("whitelisted");
            return { path: to.fullPath}
          }
        })
        
      }
      // !cookie
      else if( !ethers.utils.isAddress(cookie.wallet)  ) { 
        // - go to walletconnect
        console.log("go to whitelist")
        return { path: "/whitelist"}
      }
    }
    // connected
    if ( isConnected ) {
      console.log("navigate to route:\n", to.fullPath);
        // -navigate to route
      return true
    }
  }
  // to.whitelist
  if( to.path === "whitelist" ) {
    // - navigating to whitelist and set vars
    console.log("into whitelist");
  }


  // from.whitelist
  if( to.fullPath === "/dao/"+CONTRACTS.WEAVR ) {
    // - navigate path and reset vars
    console.log("Navigate to WEAVR____GOV______________\n\n\n");
    return {path: to.fullPath}
  }
  // no auth
  // - navigate to path
  console.log("no auth required");
  return true  
})

export default router;