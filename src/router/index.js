/* eslint-disable max-lines-per-function */
import { createRouter, createWebHashHistory, useRoute } from "vue-router";
import store from "@/store";
import { GUEST } from "../services/constants";
import { createToaster } from "@meforma/vue-toaster";
import { getCookie } from "../whitelist";
import { USER_COOKIE_KEY } from "../whitelist/constants";
import { CONTRACTS } from "@/services/constants";
import { ethers } from "ethers";

import PageNotFound from "@/components/pages/404.vue";
import Modal from "@/components/views/modal/Modal.vue";
import Homepage from "@/components/pages/Homepage.vue"
import PrivacyPage from "@/components/pages/PrivacyPage.vue"
import TermsPage from "@/components/pages/TermsPage.vue"
import Governance from "@/components/pages/Governance.vue";
import Marketplace from "@/components/pages/Marketplace";
import Dashboard from "@/components/pages/Dashboard";
import NeedlesMarketplace from "@/components/sections/Needles/NeedleMarketplace.vue";
import SingleNeedle from "@/components/sections/Needles/SingleNeedle.vue";
import ThreadsMarketplace from "@/components/sections/Threads/ThreadMarketplace.vue";
import SingleThread from "@/components/sections/Threads/SingleThread.vue";
import ThreadOverview from "@/components/views/market/ThreadOverview.vue";
import ThreadGovernance from "@/components/views/market/ThreadGovernance.vue";
import newPaperProposal from "@/components/proposals/newPaperProposal.vue";
import newParticipantProposal from "@/components/proposals/newParticipantProposal.vue";
import newParticipantRemovalProposal from "@/components/proposals/newParticipantRemoval.vue";
import newUpgradeProposal from "@/components/proposals/newUpgradeProposal.vue";
import newTokenAction from "@/components/proposals/newTokenAction.vue";
import newThreadProposal from "@/components/proposals/newThreadProposal.vue";
import newDescriptorChange from "@/components/proposals/newDescriptorChange.vue";
import newDissolutionProposal from "@/components/proposals/newDissolutionProposal.vue";
import SingleProposal from "@/components/proposals/SingleProposal.vue";
import Vouch from "@/components/proposals/Vouch";
import Queue from "@/components/proposals/Queue"
import Complete from "@/components/proposals/Complete"
import VerifyParticipant from "@/components/proposals/VerifyParticipant";
import tokenDetails from "@/components/sections/TokenDetails.vue";
import walletConnect from "@/components/sections/WalletConnect.vue";
import { WhitelistPage } from "@/whitelist";
import ComingSoon from "@/components/sections/ComingSoon/ComingSoon.vue";
import SingleComingSoonPage from "@/components/sections/ComingSoon/SingleComingSoonPage.vue";
import SumSub from "@/components/SumSub.vue";
import Airdrop from "@/components/pages/Airdrop.vue";
import AirdropClaimModal from "@/components/views/modals/AirdropClaimModal.vue"
import Login from "@/components/sections/Login.vue"

async function threadDataHelper(to, options = {withProposals: false}) {
  const {withProposals} = options 
  if(store.getters.allThreads.length == 0){
    store.dispatch("setLoadingState", {isLoading: true, message: "Loading Threads"})
    console.log("PARAMS: ",to.params);
    await store.dispatch("refreshThreads")
    if(withProposals) {
      store.dispatch("setLoadingState", {isLoading: true, message: "Loading Thread Proposals"})
      await store.dispatch("refreshProposalsDataForAsset", {assetId: to.params.threadId, forceRefresh: true})
    }
    store.dispatch("setLoadingState", {isLoading: false, message: ""})
    
  }else if(store.getters.allThreads.find( t => t.id.toLowerCase() === to.params.threadId)) {
    if(withProposals ) {
      store.dispatch("setLoadingState", {isLoading: true, message: "Loading Thread Proposals"})
      await store.dispatch("refreshProposalsDataForAsset", {assetId: to.params.threadId, forceRefresh: true}).then( () => {
        store.dispatch("setLoadingState", {isLoading: false, message: ""})
      })
      
    }
    
  }
  if(to.params.threadId && store.getters.isConnected){
    const _token = store.getters.allThreads.find( t => t.id == to.params.threadId).erc20.id
    await store.dispatch("updateWalletToken", {tokenAddress: _token})
  }
  return true
  
}

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
      props: { component: TermsPage }
    },
    {
      path: "/privacy",
      component: Modal,
      props: { component: PrivacyPage }
    },
    {
      path: "/resolutions",
      beforeEnter() {
        window.open("https://resolutions.weavr.org", "_blank")
      }
    },
    {
      path: "/faq",
      beforeEnter() {
        window.open("https://weavr-dao.gitbook.io/weavr-dao/faq/the-basics", "_blank")
      }
    },
    {
      path: "/forums",
      beforeEnter() {
        window.open("https://forum.weavr.org/", "_blanc")
      }
    },
    {
      path: "/airdrop/:airdropAddress",
      name: "airdrop",
      component: Airdrop,
      meta: { requiresAuth: false },
      children: [
        {
          path: `${CONTRACTS.AIRDROP}`,
          name: "firstAirdrop",
        }
      ]
    },
    {
      path: "/airdrop/:airdropAddress/claim",
      component: Modal,
      props: {
        component: AirdropClaimModal
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
      props: { component: walletConnect },
    },
    {
      path: "/login",
      name: "login",
      component: Modal,
      props: { component: Login }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { requiresAuth: false }
    },
    {
      path: "/marketplace",
      name: "marketplace",
      alisa: "marketplace",
      component: Marketplace,
      children: [
        {
          path: "",
          redirect: {name: "thread-market"}
        },
        {
          path: "needles",
          name: "needle-market",
          component: NeedlesMarketplace,
          meta: {requiresAuth: false},
          beforeEnter: async () => {

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
          meta: {requiresAuth: false},

          beforeEnter: async () => {

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
          meta: {requiresAuth: false},
          beforeEnter: async (to) => {
            return await threadDataHelper(to)
          }
        },
        {
          path: "threads/:threadId",
          name: "thread",
          component: SingleThread,
          meta: { requiresAuth: false},
          
          children: [
            {
              path: "",
              redirect: { name: "overview"}
            },
            {
              path: "overview",
              name: "overview",
              component: ThreadOverview,
              beforeEnter: async (to) => {
                return await threadDataHelper(to, {withProposals: true})
              },
            },
            {
              path: "governance",
              name: "governance",
              component: ThreadGovernance,
              beforeEnter: async (to) => {
                return await threadDataHelper(to, {withProposals: true})
              },
              children: [
                {
                  path: "paperProposal",
                  component: Modal,
                  props: { component: newPaperProposal },
                },
                {
                  path: "descriptorChange",
                  component: Modal,
                  props: { component: newDescriptorChange },
                },
                {
                  path: "dissolutionProposal",
                  component: Modal,
                  props: { component: newDissolutionProposal },
                },
                {
                  path: "participantRemovalProposal",
                  component: Modal,
                  props: {component: newParticipantRemovalProposal},
                },
                {
                  path: "upgradeProposal",
                  component: Modal,
                  props: { component: newUpgradeProposal },
                  meta: { locked: true }
                },
                {
                  path: "tokenProposal",
                  component: Modal,
                  props: { component: newTokenAction },
                },
                {
                  path: "proposal/:proposalId",
                  component: Modal,
                  props: { component: SingleProposal },
                  beforeEnter: async (to) => {
                    return await threadDataHelper(to, {withProposals: true})
                  },
                },
              ]
            }
          ]
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
      path: "/dao/:assetId", 
      component: Governance,

      meta: { requiresAuth: false },
      beforeEnter: async () => {
        const prop =  store.getters.proposalsPerAsset;
        // if (prop.length < 1) {
          store.dispatch("setLoadingState", {isLoading: true, message: "Loading Proposals"})
          await store.dispatch("refreshProposalsDataForAsset", {
            assetId: CONTRACTS.WEAVR,
          });
          store.dispatch("setLoadingState", {isLoading: false, message: ""})
        // }
        // clear toast
        if(store.getters.isConnected) {
          await store.dispatch("updateWalletToken", {tokenAddress: CONTRACTS.TOKEN_ADDRESS}).then( () => {
            return true;
          })
        }
        
      },
      children: [
        {
          path: `${CONTRACTS.WEAVR}`,
          name: "weavr",
        },
        {
          path: "kyc",
          name: "kyc",
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
          path: "participantRemovalProposal",
          component: Modal,
          props: {component: newParticipantRemovalProposal},
        },
        {
          path: "upgradeProposal",
          component: Modal,
          props: { component: newUpgradeProposal },
          meta: { locked: true }
        },
        {
          path: "tokenProposal",
          component: Modal,
          props: { component: newTokenAction },
        },
        {
          path: "vouch",
          name: "vouch",
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
          beforeEnter: async (from) => {
            const prop = await store.getters.proposalsPerAsset;
            // if (prop.length < 1 || ) {
              store.dispatch("refreshProposalsDataForAsset", {
                assetId: CONTRACTS.WEAVR,
              });
            // }
            // clear toast
            store.getters.isConnected ? store.dispatch("updateWalletToken", {tokenAddress: CONTRACTS.TOKEN_ADDRESS}): null
            return true;
          }
        },
        {
          path: "proposal/:proposalId/queue",
          component: Modal,
          props: { assetId: "", component: Queue }
        },
        {
          path: "proposal/:proposalId/complete",
          component: Modal,
          props: { assetId: "", component: Complete }
        },
      ]
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound },
  ],
});



// router.afterEach(async (to) => {
//   const token = to.params.threadId ? 
//     (store.getters.allThreads.find( t => t.id.toLowerCase() === to.params.threadId)).erc20.id :
//     CONTRACTS.WEAVR
//     console.log("=============================================", store.getters.allThreads.find( t => t.id.toLowerCase() === to.params.threadId))
//   if(store.getters.isConnected && (to.params.assetId || to.params.threadId)) {
//     await store.dispatch("updateWalletToken", {tokenAddress: token})
//   }
//   return true
// })

router.beforeEach(async (to) => {
  /**
   * NOTES
   * Should authorize navigation if:
   * ( isConnected + isWhitelisted || isConnected + isGuest )
   *
   * ON not connected and COOKIE should AUTOCONNECT
   * ON not connected and NO_COOKIE should send to whitelist to choose how to connect
   * ON not
   */

  const address = store.getters.userWalletAddress;
  const isConnected = ethers.utils.isAddress(address);
  const isWhitelisted = store.getters.isWhitelisted;
  // const isGuest = store.getters.guestCookie;
  const decoded_cookie = getCookie(USER_COOKIE_KEY)
  let cookie = {}
  if(decoded_cookie) {
    cookie.wallet = decoded_cookie.split("_")[0]
    cookie.provider = decoded_cookie.split("_")[1]
  }
  // require auth
  if( to.meta.locked ) {
    const toast = createToaster({});
    toast.error("The route you are trying to access is currently locked", { position: "top"});
    return false
  }
  
    // not connected
    // cookie
    if (!isConnected && ethers.utils.isAddress(cookie.wallet)) {
      console.log("____________________________ AUTOCONNECT__________________");
      // - autoconnect and navigate
      const toast = createToaster({})
      await store.dispatch("syncWallet", { wallet: cookie.provider, $toast: toast })
      await store.dispatch("checkWhitelistStatus", { assetId: CONTRACTS.WEAVR }).then(() => {
      
          // whitelisted
          return { path: to.fullPath}
        
      })

    }
     
  console.log("no wallet sync!");
  return true
})



export default router;