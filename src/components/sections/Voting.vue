<template>
  <div v-if="asset" class="container p-5 is-dark">
    <StackNavigationBar @onBack="goBack">
      {{ `${asset.address} - DAO` }}
    </StackNavigationBar>

    <div class="columns" v-if="proposals">
      <div class="column is-one-third mt-5 mb-5 mr-1 ml-1">
        <div class="panel m-2 p-4">
          <div class="image is-square">
            <img src="https://via.placeholder.com/1000" alt="Property image" />
          </div>
          <h2 id="asset-title" class="title is-4 mt-3 mb-3">
            {{ asset.address }}
          </h2>
          <div class="subtitle mt-2 mb-2 is-6">
            ({{ numberFormat.format(asset.owners.size) }} holders,
            {{ numberFormat.format(openProposalCount) }} open proposals)
          </div>

          <div class="help"><strong>Token</strong></div>
          <Address class="mb-3" :value="asset.contractAddress" />

          <div class="mb-3">
            <span class="tag m-1 is-success">badge2</span>
            <span class="tag m-1 is-warning">badge3</span>
            <span class="tag m-1 is-info">badge1</span>
            <span class="tag m-1 is-danger">badge4</span>
            <span class="tag m-1 is-success">badge2</span>
            <span class="tag m-1 is-warning">badge3</span>
            <span class="tag m-1 is-info">badge1</span>
            <span class="tag m-1 is-danger">badge4</span>
            <span class="tag m-1 is-success">badge2</span>
            <span class="tag m-1 is-warning">badge3</span>
          </div>
        </div>
        <div class="panel m-2 p-4">
          <div class="mt-2 mb-2 title is-5 has-text-weight-bold">
            Description
          </div>
          <div class="content">
            {{ asset.description }}
          </div>
          <dl class="columns is-mobile">
            <div class="column">
              <dt class="help">
                <strong>Current Rent</strong>
              </dt>
              <dd>${{ numberFormat.format(asset.currentRent) }}</dd>
            </div>
            <div class="column">
              <dt class="help">
                <strong>Market Value</strong>
              </dt>
              <dd>${{ numberFormat.format(asset.marketValue) }}</dd>
            </div>
          </dl>

          <dl class="columns is-mobile">
            <div class="column">
              <dt class="help">
                <strong>Living Space</strong>
              </dt>
              <dd>{{ numberFormat.format(asset.area) }} sqft</dd>
            </div>

            <div class="column">
              <dt class="help">
                <strong>Rooms</strong>
              </dt>
              <dd>
                {{ asset.bedroomCount }} bed, {{ asset.bathroomCount }} bath
              </dd>
            </div>
          </dl>
          <dl class="columns is-mobile">
            <div class="column">
              <dt class="help">
                <strong>Year Built</strong>
              </dt>
              <dd>
                {{ asset.yearBuilt }}
              </dd>
            </div>
            <div class="column">
              <dt class="help">
                <strong>Capitalization Rate</strong>
              </dt>
              <dd>{{ asset.grossYieldPct }}%</dd>
            </div>
          </dl>
          <dl class="columns is-mobile">
            <div class="column">
              <dt class="help"><strong>Total Supply</strong></dt>
              <dd>
                {{ numberFormat.format(asset.numOfShares) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="column is-one-third mt-5 mb-5 mr-1 ml-1">
        <div class="panel mt-2 mb-2">
          <Accordion extraClasses="is-shadowless" summary="Swap">
            <div class="field">
              <div class="subtitle is-6">
                <div>
                  <strong>1</strong> {{ asset.symbol }} =
                  <strong>{{ askPriceString }}</strong> ETH
                </div>
              </div>
            </div>
            <div class="field">
              <label for="source-token-amount" class="label">From</label>
              <div class="help has-text-grey has-text-weight-bold">
                Balance: {{ ethBalance }} ETH
              </div>
              <div class="control">
                <input
                  class="input"
                  type="number"
                  name="source-token-amount"
                  id="source-token-amount"
                  placeholder="0.0"
                  :value="orderFromString"
                  @keypress="isNumber($event)"
                  @input="orderInputUpdated(0, $event)"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label for="dest-token-amount" class="label">To</label>
              <div class="help has-text-grey has-text-weight-bold">
                Balance: {{ shareBalance }}
              </div>
              <div class="control">
                <input
                  class="input"
                  type="number"
                  name="dest-token-amount"
                  id="dest-token-amount"
                  placeholder="0"
                  :value="orderToString"
                  @keypress="isNumber($event)"
                  @input="orderInputUpdated(1, $event)"
                  required
                />
              </div>
            </div>

            <Button label="Swap" extraClasses="w-full" @click="performSwap" />
          </Accordion>
        </div>

        <div class="panel mt-2 mb-2 p-4">
          <strong>Links</strong>
          <ul>
            <li><a href="#">Contract Etherscan page</a></li>
            <li><a href="#">IPFS Document</a></li>
          </ul>
        </div>

        <div class="panel mt-2 mb-2 p-4">
          <strong>Join the discussion</strong>
          <ul>
            <li><a href="#">Discord</a></li>
          </ul>
        </div>
        <div class="panel mt-2 mb-2">
          <Accordion extraClasses="is-shadowless" summary="Price graph">
            <img class="image" src="https://via.placeholder.com/500" />
          </Accordion>
        </div>
        <div class="panel mt-2 mb-2">
          <Accordion extraClasses="is-shadowless" summary="Tokenholders">
            <ul>
              <li
                v-for="tokenholder in asset.owners.entries()"
                :key="tokenholder[0]"
              >
                <div class="pt-1 pb-1 content is-vcentered">
                  <Address :value="tokenholder[0]"></Address>
                  <span class="m-1">
                    <strong>{{ tokenholder[1] }}</strong>
                    shares
                  </span>
                </div>
              </li>
            </ul>
          </Accordion>
        </div>
      </div>
      <ul class="column is-one-third mt-5 mb-5 mr-1 ml-1">
        <li>
          <div class="panel mt-2 mb-2 p-4">
            <a href="javascript:void(0)" @click="createProposal"
              ><strong>Create a new proposal...</strong></a
            >
          </div>
        </li>
        <li v-for="proposal in proposals" :key="proposal.id">
          <ProposalListItem :assetId="assetId" :proposal="proposal" />
        </li>
      </ul>
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
    ProposalListItem,
    Accordion,
    Address,
    Button,
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
      this.$router.push(`/dao/${this.assetId}/proposals/create`);
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
    };
  },
  mounted() {
    this.refresh({ assetId: this.assetId });
    this.syncWallet();
  },
};
</script>