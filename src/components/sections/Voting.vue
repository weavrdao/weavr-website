<template>
  <div v-if="assetId" class="container p-5 is-dark">
    <StackNavigationBar @onBack="goBack">
      {{ `${assetId} - DAO` }}
    </StackNavigationBar>
    <div>
      {{ proposalsList }}
      <h2>
        ASSET: {{asset}}
      </h2>
      <router-view :assetId="assetId"></router-view>
    </div>
  </div>
</template>

<style scoped>
.content.is-vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center; /* used this for multiple child */
}
</style>

<script>
import { toFixedNumber } from "../../utils/common";
import { mapGetters, mapActions } from "vuex";
import StackNavigationBar from "../layout/navigation/StackNavigationBar.vue";
import Button from "../views/common/Button.vue";
import ProposalListItem from "../views/voting/ProposalListItem.vue";
import Accordion from "../utils/Accordion.vue";
import Address from "../views/address/Address.vue";

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
    // ProposalListItem,
    // Accordion,
    // Address,
    // Button,
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
      console.log("HERE");
      console.log(this.assetProposalMap.get(this.assetId))
      return this.assetProposalMap.get(this.assetId);
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

    createProposal() {
      this.$router.push(`/dao/${this.assetId}/paperProposal`);
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
    /* eslint-disable indent */
    orderInputUpdated(index, event) {
      switch (index) {
        case 0:
          this.orderFromValue = event.target.value;
          console.log("eth field value", event.target.value);
          this.orderToValue = this.convertToShares(
            this.orderFromValue
          ).toString();
          break;
        case 1:
          this.orderToValue = event.target.value;
          console.log("shares field value", event.target.value);
          this.orderFromValue = this.convertToETH(this.orderToValue).toString();
          break;
        default:
          break;
      }
    },
    convertToETH(shares) {
      console.log(this.askPrice);
      return shares * this.askPrice;
    },
    convertToShares(eth) {
      return eth / this.askPrice;
    },
    async performSwap() {
      await this.swap({
        asset: this.asset,
        amount: this.orderToValue,
        $toast: this.$toast,
      });
      this.orderFromValue = 0;
      this.orderToValue = 0;
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
    };
  },
  mounted() {
    this.refresh({ assetId: this.assetId });
    this.syncWallet();
  },
};
</script>