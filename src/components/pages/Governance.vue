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
      assetMap: "assetsById",
      assetProposalMap: "assetProposals",
      ethBalance: "userEthBalance",
      walletAddress: "userWalletAddress",
      assetPrices: "bestAssetPrices",
    }),

    assetId() {
      this.$route.fullPath.includes("marketplace") ? this.$route.params.threadId : console.log("WEAVR")
      return this.$route.params.assetId != "marketplace" ? this.$route.params.assetId : this.$route.params.threadId
    },

    proposals() {
      return this.assetProposalMap;
    },

    activeProposals() {
      return this.assetProposalMap.filter((proposal) => {
        const endTime = new Date(proposal.endTimestamp * 1000);
        const currentTime = new Date();
        return (currentTime < endTime) && proposal.state != "Cancelled";
      });
    },

    pastProposals() {
      return this.assetProposalMap.filter((proposal) => {
        const endTime = new Date(proposal.endTimestamp * 1000);
        const currentTime = new Date();
        return (currentTime > endTime );
      });
    },
    cancelledProposals() {
      return this.assetProposalMap.filter((proposal) => {
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
      this.refreshProposals({ assetId: this.assetId, forceRefresh: true });    
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
    createProposal() {
      this.$router.push(`/dao/${this.assetId}/paperProposal`);
    }
  },

  data() {
    return {
      showSelector: false,
      isActiveProposals: true
    };
  },
};
</script>