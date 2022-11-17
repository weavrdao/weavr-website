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
import Vouch from "@/components/proposals/Vouch";
import SumSub from "@/components/SumSub.vue";
const router = new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/weavr",
    },
    {
      path: "/marketplace",
      name: "Marketplace",
      beforeEnter: (to, from, next) => {
        if(window.location.href.includes("localhost")) {
          window.location.href = "http://localhost:9090/#/marketplace"
        } else {
          window.location.href = "https://app.weavr.org/#/marketplace";
        }
      }
    },
    {
      path: "/governance",
      name: "Governance",
      beforeEnter: (to, from, next) => {
        if(window.location.href.includes("localhost")) {
          window.location.href = "http://localhost:9090/#/weavr";
        } else {
          window.location.href = "https://app.weavr.org/#/weavr";
        }
      }
    },
    {
      path: "/resolutions",
      name: "Resolutions",
        beforeEnter: (to, from, next) => {
        window.location.href = "https://resolutions.weavr.org";
        }
    },
    {
      path: "/faq",
      name: "FAQ",
      beforeEnter: (to, from, next) => {
        window.location.href = "https://weavr-dao.gitbook.io/weavr-dao/welcome-to-weavr/the-basics";
      }
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
      path: "/weavr/vouch",
      name: "vouch",
      component: Modal,
      props: {assetId: CONTRACTS.WEAVR, component: Vouch},
    },
    {
      path: "/weavr/kyc",
      name: "kyc",
      component: Modal,
      props: {assetId: CONTRACTS.WEAVR, component: SumSub}
    },
    {
      path: "/weavr",
      alias: "/weavr",
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

export default router;
