<template>
  <div v-if="assetId" class="container p-5 is-dark">
      <!-- <div class="my-5"><RefreshButton  @refreshed="() => {}" :assetId="assetId"/></div>
      <div class="button is-primary" @click="refresh">Refresh</div> -->
    <StackNavigationBar @onBack="goBack" :address="assetId" />
   
    <NewProposalSelector/>
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

    <div class="my-3 is-flex is-justify-content-flex-end">
      <div class="button is-primary" @click="refresh">
        <span class="icon">
           <unicon width="15" height="15" name="sync" fill="white"></unicon>
        </span>
        <span>Refresh</span>     
      </div>
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
import { mapGetters, mapActions } from "vuex";
import StackNavigationBar from "../layout/navigation/StackNavigationBar.vue";
import ProposalList from "../proposals/ProposalList.vue";
import NewProposalSelector from "../sections/NewProposalSelector.vue";
import {CONTRACTS }from "@/services/constants"
// import RefreshButton from "../sections/RefreshButton.vue";

export default {
  name: "Governance",
  components: {
    StackNavigationBar,
    ProposalList,
    NewProposalSelector,
    // RefreshButton
  },
  
  computed: {
    ...mapGetters({
      proposalsPerAsset: "proposalsPerAsset",
      walletAddress: "userWalletAddress",
    }),

    assetId() {
      this.$route.params.threadId ? this.$route.params.threadId : console.log("WEAVR")
      return this.$route.params.assetId? this.$route.params.assetId : this.$route.params.threadId
    },

    proposals() {
      return this.proposalsPerAsset.get(this.assetId.toLowerCase());
    },

    activeProposals() {
      return this.proposals.filter((proposal) => {
        const endTime = new Date(proposal.endTimestamp * 1000);
        const currentTime = new Date();
        return (currentTime < endTime) && proposal.state != "Cancelled";
      });
    },

    pastProposals() {
      return this.proposals.filter((proposal) => {
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
      refreshProposals: "refreshProposalsDataForAsset",
      
    }),
    refresh() {
      this.refreshProposals({ assetId: this.$route, forceRefresh: true });    
    },
    goBack() {
      this.$router.back();
    },
    navigateTo(routeName) {
      this.$router.push({name: routeName})
    },
    isTabActive(tabName) {
      return this.$route.fullPath.includes(tabName)
    },
  },
  data() {
    return {
      showSelector: false,
      isActiveProposals: true
    };
  },
 
  
};
</script>