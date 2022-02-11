import { createRouter, createWebHashHistory } from 'vue-router'
import Voting from '@/components/sections/Voting.vue'
import Proposal from '@/components/sections/Proposal.vue'
import NewProposal from '@/components/sections/NewProposal.vue'

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
      path: '/dao/:assetId/proposals/:proposalId',
      name: 'proposal',
      props: true,
      component: Proposal,
    },
    {
      path: '/dao/:assetId/proposals/create',
      name: 'newProposal',
      props: true,
      component: NewProposal,
    },
  ],
})
