<template>
  <section v-bind:aria-label="asset.address" class="card">
    <div class="card-content">
      <Accordion
        :summary="asset.address"
        :shadow="false"
        :margin="0"
        :padding="0"
        extraClasses="ml-0"
      >
        <div class="media">
          <div class="media-content">
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

            <div class="has-text-left">
              <div class="help"><strong>Token</strong></div>
              <Address class="mb-3" :value="asset.contractAddress" />
            </div>
            <div class="is-flex is-justify-content-space-between">
              <div style="width: 50%">
                <div class="help"><strong>Balance</strong></div>
                <div class="has-text-left">
                  {{ numberFormat.format(shareBalance) }}
                </div>
              </div>
              <div style="width: 50%">
                <div class="help"><strong>Total Supply</strong></div>
                <div class="has-text-left">
                  {{ numberFormat.format(asset.numOfShares) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="subtitle m-1 is-6">
          {{ numberFormat.format(asset.owners.size) }} holders,
          {{ numberFormat.format(openProposalCount) }} open proposals
        </div>

        <Button
          :isPrimary="true"
          label="Open DAO"
          @click="openDAO"
          extraClasses="p-0 pl-2 pr-2"
        />
      </Accordion>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Address from "../address/Address.vue";
import Button from "../common/Button.vue";
import Accordion from "../../utils/Accordion.vue";

export default {
  name: "AssetListItem",
  components: {
    Address,
    Button,
    Accordion,
  },
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      numberFormat: new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 3,
      }),
      coverPictureURI: require("../../../assets/pics/fbra.jpg"),
    };
  },
  computed: {
    ...mapGetters({
      walletAddress: "userWalletAddress",
    }),
    shareBalance() {
      return this.asset.owners.get(this.walletAddress);
    },
    timestamp() {
      return Math.floor(Date.now() / 1000);
    },
    openProposalCount() {
      return this.asset.proposals.filter((p) => {
        return p.endTimestamp > this.timestamp;
      }).length;
    },
  },
  methods: {
    openSwap() {
      this.$router.push("/swap");
    },
    openDAO() {
      this.$router.push(`/dao/${this.asset.id}/proposals`);
    },
  },
};
</script>