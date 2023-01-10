import {createRouter, createWebHashHistory} from "vue-router";
import Airdrop from "@/components/pages/Airdrop.vue";
import Modal from "@/components/views/modal/Modal.vue";
import walletConnect from "@/components/sections/WalletConnect.vue";
import Login from "@/components/sections/Login.vue";

const routerAirdrop = new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Airdrop
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
    }]
})
export default routerAirdrop;