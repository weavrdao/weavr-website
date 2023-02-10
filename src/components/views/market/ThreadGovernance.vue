<template>
  <div>
    
    <NewProposalSelector :isThread="true"></NewProposalSelector>
   <div class="tabs is-toggle is-toggle-rounded is-centered  ">
      <ul>
        <li :class="[ isActiveProposals ? 'is-active' : '' ]">
          <a v-on:click="isActiveProposals=true">Active Proposals</a>
        </li>
        <li :class="[ !isActiveProposals ? 'is-active' : '' ]">
          <a disabled="true" aria-disabled="true" v-on:click="isActiveProposals=false">Past Proposals</a>
        </li>
      </ul>
    </div>

    
      <ProposalList
          v-if="isActiveProposals"
          :proposals="activeProposals"
          :assetId="assetId"
          :proposalStatus="`Active Proposals`"/>
      <ProposalList
          v-else
          :proposals="pastProposals"
          :assetId="assetId"
          :proposalStatus="`Past Proposals`"/>
    <router-view></router-view>
  </div>
</template> 

<script>
// import ProposalList from "@/components/proposals/ProposalList"
import NewProposalSelector from "@/components/sections/NewProposalSelector"
import { mapGetters } from "vuex"
export default {
  name: "ThreadGovernance",
  components: {
    // ProposalList
    NewProposalSelector,
  },
  data() {
    return {
      isActiveProposals: true
    }
  },
  computed: {
    ...mapGetters({
      threads: "threadById",

    }),
    thread() {
      return this.threads.get(this.$route.params.threadId)
    },
  },
}
</script>