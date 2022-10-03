<template>
  <div v-if="assetId" class="container p-5 is-dark">
    <StackNavigationBar @onBack="goBack" :address="assetId" />
    <NewProposalSelector/>
    <RefreshButton :assetId="assetId"/>
    <div class="columns is-variable is-8">
      <ProposalList
        :proposals="activeProposals"
        :assetId="assetId"
        :proposalStatus="`Active Proposals`"/>
      <ProposalList
        :proposals="pastProposals.concat(cancelledProposals)"
        :assetId="assetId"
        :proposalStatus="`Past Proposals`"/>
    </div>
      <router-view :assetId="assetId"></router-view>
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

export default {
  name: "Voting",
  props: {
    assetId: {
      type: String,
      required: true,
    },
  },
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

    asset() {
      return this.assetMap.get(this.assetId);
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

    data() {
      return {
        numberFormat: new Intl.NumberFormat("en-US", {
          maximumSignificantDigits: 3,
        }),
        orderFromValue: "",
        orderToValue: "",
        proposalsList: this.proposals,
      };
    },
  },
  mounted() {
    this.refresh({ assetId: this.assetId, $toast: this.$toast });
    // this.syncWallet();
  }
};
</script>