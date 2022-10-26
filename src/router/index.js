import { createRouter, createWebHashHistory } from 'vue-router';
import PageNotFound from "@/components/pages/404.vue";
import Modal from "@/components/views/modal/Modal.vue"
import Homepage from "@/components/pages/Homepage.vue"
import PrivacyPage from "@/components/pages/PrivacyPage.vue"
import Login from "@/components/sections/Login.vue"
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
      redirect: "/weavr",
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
      path: "/weavr",
      alias: "/weavr",
      component: Homepage
    },
    {
      path: "/privacy",
      component: PrivacyPage,
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

  if(to.fullPath === "/walletConnect" || to.fullPath === "/login") {
    return true;
  }

  const address = store.getters.userWalletAddress;
  const guest = store.getters.isGuest;
  const isConnected = ethers.utils.isAddress(address) || guest;
  if(!isConnected) {
    router.push("/");
  }
  const whitelisted = store.getters.isWhitelisted;
  
  if(whitelisted || guest) {
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
