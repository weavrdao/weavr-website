import {createRouter, createWebHistory, createWebHashHistory} from "vue-router";
import PageNotFound from "@/components/pages/404.vue";
import Modal from "@/components/views/modal/Modal.vue"
import Homepage from "@/components/pages/Homepage.vue"
import PrivacyPage from "@/components/pages/PrivacyPage.vue"
import TermsPage from "@/components/pages/TermsPage.vue"
import Login from "@/components/sections/Login.vue"
import walletConnect from "@/components/sections/WalletConnect.vue"
import {getCookie, WhitelistPage} from "../whitelist";
import {CONTRACTS, DAO, GUEST} from "../services/constants"
import {createToaster} from "@meforma/vue-toaster";
import store from "../store";
import {ethers} from "ethers";
import { USER_COOKIE_KEY } from "../whitelist/constants";

const router = new createRouter({
  history: createWebHistory(),
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
      path: "/login",
      component: Modal,
      props: {component: Login}
    },
    {
      path: "/home",
      alias: "/home",
      name: "home",
      component: Homepage
    },
    {
      path: "/privacy",
      component: PrivacyPage,
    },
    {
      path: "/toc",
      component: TermsPage,
    },
    {path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound},
  ],
});

let originalPath = "";
let hasOriginalPathBeenSet = false;
let hasRedirectedAfterWhitelisting = false;

router.beforeEach((to, from) => {
  /**
   * NOTES
   * Should authorize navigation if:
   * ( isConnected + isWhitelisted || isConnected + isGuest )
   * 
   * ON not connected and COOKIE should AUTOCONNECT
   * ON not connected and NO_COOKIE should send to whitelist to choose how to connect
   * 
   */
   
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
   if(!isConnected) {
     if(cookie != GUEST && ethers.utils.isAddress(cookie)) {
       console.log("Ready to sync!!!")
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
        console.log("GOING____");
        router.push({path: "/home"})
      })
     }
   }
   if(isConnected && isWhitelisted || isGuest) {
     console.log("all connected", to.path);
     let route = {
       path: to.path
     }
     to.path === "/home" ? route.params = { assetId: CONTRACTS.WEAVR } : null;
     return true
   }
   if((to.meta.requiresAuth && !isConnected) || (to.meta.requiresAuth && !isGuest)) {
     console.log(router)
     router.push({name: "whitelist"})
     console.log("AUTH")
   }
 });

export default router;
