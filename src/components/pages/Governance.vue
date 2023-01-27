<template>
  <div v-if="assetId" class="container p-5 is-dark">
    <StackNavigationBar @onBack="goBack" :address="assetId" />
    <div class="is-flex is-justify-content-end">
      <button class="button is-primary" v-on:click="toggleSelector">{{ showSelector ? "Close dialog": "New Proposal" }}</button>
    </div>
    <NewProposalSelector v-if="showSelector"/>

    <div class="mt-2"><RefreshButton :assetId="assetId"/></div>
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

<style scoped>
.content.is-vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center; /* used this for multiple child */
}

.columns {
  /* Bulma uses negative margin and ruins alignment  */
  margin-left: unset !important;
  margin-right: unset !important;
  margin-top: 1.5rem;
  gap: 1.5rem;
}
</style>

<script>
import { toFixedNumber } from "../../utils/common";
import { mapGetters, mapActions } from "vuex";
import StackNavigationBar from "../layout/navigation/StackNavigationBar.vue";
import ProposalList from "../proposals/ProposalList.vue";
import NewProposalSelector from "../sections/NewProposalSelector.vue";
import RefreshButton from "../sections/RefreshButton.vue";
import store from "@/store";

export default {
  name: "Governance",
  components: {
    StackNavigationBar,
    ProposalList,
    NewProposalSelector,
    RefreshButton,
  },
  computed: {
    ...mapGetters({
      assetMap: "assetsById",
      assetProposalMap: "assetProposals",
      ethBalance: "userEthBalance",
      walletAddress: "userWalletAddress",
      assetPrices: "bestAssetPrices",
    }),

    shareBalance() {
      return this.asset.owners.get(this.walletAddress) ?? 0;
    },

    assetId() {
      this.$route.fullPath.includes("marketplace") ? this.$route.params['threadId'] : console.log("WEAVR")
      return this.$route.params['assetId'] != 'marketplace' ? this.$route.params['assetId'] : this.$route.params['threadId']
    },

    proposals() {
      return this.assetProposalMap;
    },

    timestamp() {
      return Math.floor(Date.now() / 1000);
    },

    openProposalCount() {
      return this.asset.proposals.filter((p) => {
        return p.endTimestamp > this.timestamp;
      }).length;
    },

    orderToString() {
      return toFixedNumber(this.orderToValue);
    },

    orderFromString() {
      return toFixedNumber(this.orderFromValue);
    },

    askPrice() {
      var askETH = this.assetPrices.get(this.asset.id).ask;
      if (askETH) {
        askETH = askETH.toString() / Math.pow(10, 18);
      } else {
        askETH = 0.0;
      }
      return askETH;
    },

    askPriceString() {
      return toFixedNumber(this.askPrice);
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
      refresh: "refreshProposalsDataForAsset",
      syncWallet: "syncWallet",
      swap: "swapToAsset",
    }),
    
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
    },
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },

  data() {
    return {
      numberFormat: new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 3,
      }),
      orderFromValue: "",
      orderToValue: "",
      proposalsList: this.proposals,
      showSelector: false,
      isActiveProposals: true
    };
  },

  mounted() {
    console.log("GOV_CHECK__ASSET_ID___",this.$route.params['assetId']);
    console.log("PROPOSALS: ", this.assetProposalMap);
    console.log(this.pastProposals)
    // this.refresh({ assetId: this.assetId, $toast: this.$toast });
    // this.syncWallet();
  },
};
</script>