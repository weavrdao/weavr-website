<template>
   <div class="">
    <div class="block">
        <Address :value="threadId"/>
    </div>
    <div class="block">
      <NewProposalSelector :isThread="true"/>
    </div>
    <div class="my-3 is-flex is-justify-content-flex-end">
      <div class="button is-primary" @click="refresh">
        <span class="icon">
           <unicon width="15" height="15" name="sync" fill="white"></unicon>
        </span>
        <span>Refresh</span>     
      </div>
    </div>
    <div class="columns">
        <div class="column is-one-fifth">
            <aside class="menu">
                <p class="menu-label">
                    Proposals
                </p>
                <ul class="menu-list">
                    <li><a :class="showPastProposals? '' : 'has-text-primary'" @click="show(false)">Active</a></li>
                    <li><a :class="showPastProposals? 'has-text-primary' : ''" @click="show(true)">Past</a></li>
                </ul>
            </aside>
        </div>
        
        <div class="column">
            <ProposalList :proposals="showPastProposals? this.pastProposals : this.activeProposals" :proposalStatus="showPastProposals? 'Past Proposals':'Active Proposals'" :assetId="thread.id"/>
        </div>
        <router-view></router-view>
    </div>
  </div>    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ProposalList from "@/components/proposals/ProposalList.vue";
import Address from "../address/Address.vue";
import { useRoute } from 'vue-router';
import NewProposalSelector from '../../sections/NewProposalSelector.vue';
export default {
  name: "ThreadGovernance",
  components: {
    ProposalList,
    NewProposalSelector,
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
      proposalsPerAsset: "proposalsPerAsset",
    }),
    thread() {
      return this.threads.get(this.$route.params['threadId'])
    },
    proposals() {
      return this.proposalsPerAsset.get(this.$route.params['threadId'].toLowerCase())
    },
    activeProposals() {
      return this.proposalsPerAsset.get(this.$route.params['threadId'].toLowerCase()).filter((proposal) => {
        const endTime = new Date(proposal.endTimestamp * 1000);
        const currentTime = new Date();
        return (currentTime < endTime) && proposal.state != "Cancelled";
      });
    },

    pastProposals() {
      return this.proposalsPerAsset.get(this.$route.params['threadId'].toLowerCase()).filter((proposal) => {
        const endTime = new Date(proposal.endTimestamp * 1000);
        const currentTime = new Date();
        return (currentTime > endTime );
      });
    },
    cancelledProposals() {
      return this.proposals.filter((proposal) => {
        console.log(proposal.state)
        return proposal.state == "Cancelled";
      });

    }
  },
  methods: {
    ...mapActions({
      fetchThreads: "refreshThreads",
      refreshProposals: "refreshProposalsDataForAsset",
    }),
    refresh() {
      this.refreshProposals({ assetId: this.threadId, forceRefresh: true, isThread: true });    
    },
    show(list) {
        this.showPastProposals = list ? true : false
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/weavr-custom.scss";
@import "@/styles/markdown.scss";


</style>>
