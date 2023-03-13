<template>
   <div class="">
    <div class="block">
        <Address :value="threadId"/>
    </div>
    <div class="columns">
        <div class="column is-one-fifth">
            <aside class="menu">
                <p class="menu-label">
                    Proposals
                </p>
                <ul class="menu-list">
                    <li><a @click="show(false)">Active</a></li>
                    <li><a @click="show(true)">Past</a></li>
                </ul>
            </aside>
        </div>
        <div class="column">
            <ProposalList :proposals="[]" :proposalStatus="showPastProposals? 'Past Proposals':'Active Proposals'" :assetId="thread.id"/>
        </div>
    </div>
    
    
    
   </div>    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ProposalList from "@/components/proposals/ProposalList.vue";
import Address from "../address/Address.vue";
import { useRoute } from 'vue-router';
export default {
  name: "ThreadGovernance",
  components: {
    ProposalList,
    Address,
  }, 
  data() {
    return {
      threadId: useRoute().params.threadId,
      showPastProposals: false
    }  
  },
  computed: {
    ...mapGetters({
      threads: "threadById",
    }),
    thread() {
      return this.threads.get(this.$route.params['threadId'])
    }
  },
  methods: {
    ...mapActions({
      fetchThreads: "refreshThreads",
    }),
    show(list) {
        this.showPastProposals = list ? true : false
    }
  },
  mounted() {
    console.log(this.thread);
  }
}
</script>

<style lang="scss">
@import "@/styles/weavr-custom.scss";
@import "@/styles/markdown.scss";


</style>>
