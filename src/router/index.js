import { createRouter, createWebHashHistory } from 'vue-router'
import Voting from '@/components/sections/Voting.vue'
import Proposal from '@/components/sections/Proposal.vue'
import newPaperProposal from "@/components/proposals/newPaperProposal.vue"
import newParticipantProposal from "@/components/proposals/newParticipantProposal.vue"

export default new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dao/0/proposals',
    },
    {
      path: '/dao/:assetId/proposals',
      name: 'dao',
      props: true,
      component: Voting,
    },
    {
      path: '/dao/0/proposals',
      name: 'frabric',
      component: Voting
    },
    {
      path: '/dao/:assetId/proposal/:proposalId',
      name: 'proposal',
      props: true,
      component: Proposal,
    },
    {
      path: '/dao/:assetId/newPaperProposal',
      name: 'newPaperProposal',
      props: true,
      component: newPaperProposal,
    },
    {
      path: '/dao/:assetId/newParticipantProposal',
      name: 'newParticipantProposal',
      props: true,
      component: newParticipantProposal,
    },
  ],
})
