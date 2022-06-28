import { createRouter, createWebHashHistory } from 'vue-router'
import Voting from '@/components/sections/Voting.vue'
import Proposal from '@/components/sections/Proposal.vue'
import QuickProposal from "@/components/proposals/QuickProposal.vue"

export default new createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/quickProposal',
    },
    {
      path: '/dao/:assetId/',
      name: 'dao',
      props: true,
      component: Voting,
    },
    {
      path: '/dao/:assetId/:proposalId',
      name: 'proposal',
      props: true,
      component: Proposal,
    },
    {
      path: '/quickProposal',
      name: 'quickProposal',
      props: true,
      component: QuickProposal,
    }
  ],
})
