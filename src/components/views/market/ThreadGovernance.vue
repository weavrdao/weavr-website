<template>
  <div>
    
    <NewProposalSelector></NewProposalSelector>
  </div>
</template>

<script>
// import ProposalList from "@/components/proposals/ProposalList"
import NewProposalSelector from "@/components/sections/NewProposalSelector"
import { mapGetters } from 'vuex'
export default {
  name: "ThreadGovernance",
  components: {
    // ProposalList
    NewProposalSelector
  },
  data() {
    return {
      
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