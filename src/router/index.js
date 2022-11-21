import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import PageNotFound from "@/components/pages/404.vue";
import Modal from "@/components/views/modal/Modal.vue";
import Homepage from "@/components/pages/Homepage.vue"
import PrivacyPage from "@/components/pages/PrivacyPage.vue"
import TermsPage from "@/components/pages/TermsPage.vue"
import Governance from "@/components/pages/Governance.vue";
import Marketplace from "@/components/pages/Marketplace"
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
        location.href = "https://resolutions.weavr.org"
      }
    },
    {
      path: "/faq",
      beforeEnter(){
        location.href = "https://weavr-dao.gitbook.io/weavr-dao/faq/the-basics"
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
          path: "",
          component: ComingSoon,
          meta: { requiresAuth: false}
        },
        {
          path: "needles",
          name: "needle-market",
          component: NeedlesMarketplace,
        },
        {
          path: "needle/:needleId",
          name: "needle",
          component: SingleNeedle,
        },
        {
          path: "coming-soon",
          name: "comingSoon",
          component: ComingSoon,
        },
        {
          path: "coming-soon/:comingSoonId",
          name: "singleComingSoon",
          component: SingleComingSoonPage,
        },
      ]
    },  
    {
      path: "/".concat(DAO).concat("/:assetId"),
      alias: "/".concat(DAO),
      name: "governance",
      component: Governance,
      props: {assetId: CONTRACTS.WEAVR},
      meta: { requiresAuth: true },
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
   const isGuest = store.getters.isGuest;
   const cookie = getCookie(USER_COOKIE_KEY)
   
   console.log(cookie)
   console.log(to,{
     path: to.path,
     isConnected,
     isWhitelisted
   })

   if (to.meta.requiresAuth) {
      console.log("Requires LOG");
      if(!hasOriginalPathBeenSet) {
        originalPath = to.fullPath
        hasOriginalPathBeenSet = true
      }
    // NOT_CONNECTED
     if(!isConnected) {
      // NO_COOKIE AND BEFORE REDIRECT
      if( !cookie && !hasRedirectedAfterWhitelisting) {
        console.log("COOKIE__AUTH___", cookie);
        hasRedirectedAfterWhitelisting = true
        originalPath = to.fullPath
        return {path: "/whitelist"}
      }
      // COOKIE NOT GUEST
      if(ethers.utils.isAddress(cookie)) {
        if(cookie != GUEST) {
          const logging = new Promise( 
            (res) => {
              store.dispatch(
                "syncWallet", 
                {
                  $toast: createToaster({
                    message: "sync"
                }) ,
              wallet: "metamask"
            })
          })
          Promise.resolve(logging).then( () => {
            console.log("AFTER_CONNECT___");
            return hasOriginalPathBeenSet ? originalPath : to.path
          })
        }
      }  
    }
    // CONNECTED AND WHITELISTED
    if(isConnected && isWhitelisted || isGuest) {
      if(hasRedirectedAfterWhitelisting) {
        console.log("HAS_REDIRECTED AND RETURN");
        await store.dispatch("checkWhitelistStatus", {}).then( () => {
          console.log("DONE");
        })
        return hasOriginalPathBeenSet ? originalPath : to.path
      }
      console.log("all connected", to.path);
      let route = {
        path: to.path
      }
      hasRedirectedAfterWhitelisting = true  
      return { name: "whitelist"}
    }
    // IN ANY CASE OF REQUIRED AUTH AND NON OF THE ABOVE
    
    console.log(from.path, to.path)
    
    
    
  } 
  // AUTH NOT REQUIRED 
  else {
    console.log("// it goes ahead to the path", hasOriginalPathBeenSet)
    // return true
    if(hasRedirectedAfterWhitelisting) {
      console.log("SET___ NAVIGATE TO....", originalPath);
      hasRedirectedAfterWhitelisting = false
      return {path: originalPath}
    }
    return true
  }
})
export const ORIGINAL_PATH = originalPath
export default router;