import { createRouter, createWebHashHistory } from 'vue-router'
import PageNotFound from "@/components/pages/404.vue";
import Modal from '@/components/views/modal/Modal.vue'
import Homepage from "@/components/pages/Homepage.vue"
import newPaperProposal from "@/components/proposals/newPaperProposal.vue"
import newParticipantProposal from "@/components/proposals/newParticipantProposal.vue"
import newUpgradeProposal from "@/components/proposals/newUpgradeProposal.vue"
import newTokenAction from "@/components/proposals/newTokenAction.vue"
import vouch from "@/components/proposals/vouch"
import Proposal from "@/components/sections/Proposal.vue";
import { WEAVR_ADDRESS } from '../services/constants'

export default new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/frabric"
    },
    {
      path: "/dao/:assetId",
      component: Homepage,
      props: { assetId: WEAVR_ADDRESS },
      alias: "/frabric",
      children: [
        {
          path: "paperProposal",
          component: Modal,
          props: { assetId: "dd", component: newPaperProposal }
        },
        {
          path: "participantProposal",
          component: Modal,
          props: { assetId: "dd", component: newParticipantProposal }
        },
        {
          path: "upgradeProposal",
          component: Modal,
          props: { assetId: "dd", component: newUpgradeProposal }
        },
        {
          path: "tokenProposal",
          component: Modal,
          props: { assetId: "dd", component: newTokenAction },
        },
        {
          path: "vouch",
          component: Modal,
          props: { assetId: "dd", component: vouch }
        },
        {
          path: "proposal/:proposalId",
          component: Modal,
          // (bill) Hardcording proposal ID as temp measure, this does not work rn
          props: { proposalId: 0, component: Proposal }
        }
      ]
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound },
  ],
})
