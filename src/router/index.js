import { createRouter, createWebHashHistory } from "vue-router";
import PageNotFound from "@/components/pages/404.vue";
import Modal from "@/components/views/modal/Modal.vue";
import Homepage from "@/components/pages/Homepage.vue";
import newPaperProposal from "@/components/proposals/newPaperProposal.vue";
import newParticipantProposal from "@/components/proposals/newParticipantProposal.vue";
import newUpgradeProposal from "@/components/proposals/newUpgradeProposal.vue";
import newTokenAction from "@/components/proposals/newTokenAction.vue";
import SingleProposal from "@/components/proposals/SingleProposal.vue";
import vouch from "@/components/proposals/vouch";
import { WEAVR_ADDRESS } from "../services/constants";

const router = new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Homepage,
      props: { assetId: process.env.VUE_APP_WEAVR_ADDRESS },
      children: [
        {
          path: "proposal/:proposalId",
          component: Modal,
          props: { assetId: "dd", component: SingleProposal },
        },
      ],
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound },
  ],
});

// router.beforeEach((to, from) => {

// });

export default router;
