import { createRouter, createWebHashHistory } from "vue-router";
import Marketplace from "@/components/sections/Marketplace.vue";
import Voting from "@/components/sections/Voting.vue";
import Proposal from "@/components/sections/Proposal.vue";
import NewProposal from "@/components/sections/NewProposal.vue";
import MarketListDetailVue from "../components/views/market/MarketListDetail.vue";

export default new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/market",
    },
    {
      path: "/market",
      name: "market",
      component: Marketplace,
    },
    {
      path: "/dao/:assetId/proposals",
      name: "dao",
      props: true,
      component: Voting,
    },
    {
      path: "/dao/:assetId/proposals/:proposalId",
      name: "proposal",
      props: true,
      component: Proposal,
    },
    {
      path: "/dao/:assetId/proposals/create",
      name: "newProposal",
      props: true,
      component: NewProposal,
    },
    {
      path: "/dao//details",
      name: "assetDetails",
      props: true,
      component: MarketListDetailVue,
    },
  ],
});
