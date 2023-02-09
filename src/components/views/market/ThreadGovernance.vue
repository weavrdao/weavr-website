<template>
  <div>
    
    <NewProposalSelector :isThread="true"></NewProposalSelector>
    <div class="block">
      <AccordionVue summary="Active Proposals">

      </AccordionVue>
      <AccordionVue summary="Past Proposals">

      </AccordionVue>
    </div>
    <router-view></router-view>
  </div>
</template> 

<script>
// import ProposalList from "@/components/proposals/ProposalList"
import NewProposalSelector from "@/components/sections/NewProposalSelector"
import { mapGetters } from 'vuex'
import AccordionVue from '../../utils/Accordion.vue'
export default {
  name: "ThreadGovernance",
  components: {
    // ProposalList
    NewProposalSelector,
    AccordionVue
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