import { createRouter, createWebHashHistory } from 'vue-router'
import Voting from '@/components/sections/Voting.vue'
import newPaperProposal from "@/components/proposals/newPaperProposal.vue"
import newParticipantProposal from "@/components/proposals/newParticipantProposal.vue"
import newUpgradeProposal from "@/components/proposals/newUpgradeProposal.vue"
import newTokenAction from "@/components/proposals/newTokenAction.vue"
import vouch from "@/components/proposals/vouch"
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
      props: {assetId: "0x0d443712225ad4d31c9086fc7564cc86f8219567"},
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
        },
        {
          path: "upgradeProposal",
          component: newUpgradeProposal,
          props: {assetId: "dd"}
        },
        {
          path: "tokenProposal",
          component: newTokenAction,
          props: {assetId: "dd"},
        },
        {
          path: "vouch",
          component: vouch,
          props: {assetId: "dd"}
        }
      ]
    }
  ],
})
