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
import {CONTRACTS, DAO} from "../services/constants"




const router = new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/".concat(DAO)
    },
    {
      path: "/dao/:assetId",
      component: Homepage,
      props: { assetId:  CONTRACTS.WEAVR},
      alias: "/".concat(DAO),
      children: [
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
          props: { assetId: "", component: SingleProposal }
        }
      ]
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound },
  ],
});

// router.beforeEach((to, from) => {

// });

export default router;
