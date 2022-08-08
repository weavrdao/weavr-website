import { createRouter, createWebHashHistory } from 'vue-router'
import Voting from '@/components/sections/Voting.vue'
import Proposal from '@/components/sections/Proposal.vue'
import newPaperProposal from "@/components/proposals/newPaperProposal.vue"
import newParticipantProposal from "@/components/proposals/newParticipantProposal.vue"

export default new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/frabric"
    },
    {
      path: "/dao/:assetId",
      component: Voting,
      props: {assetId: "0x8C1a3931102f4D65c91f2DDA5166f8970f2760A8"},
      alias: "/frabric",
      children: [
        {
          path: "paperProposal",
          component: newPaperProposal,
          props: {assetId: "dd"}
        },
        {
          path: "participantProposal",
          component: newParticipantProposal,
          props: {assetId: "dd"}
        }
      ]
    }
  ],
})
