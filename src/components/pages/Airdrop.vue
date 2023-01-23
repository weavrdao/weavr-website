<template>
  <div>
    <div class="container p-5">
      <h3 class="title is-3">Airdrop
        <Address :value="airdropAddress"/>
      </h3>
      <div class="columns">
        <div class="column is-half py-4 is-size-5 has-text-white">
          <p>
            You've put in incredible work to get us here, and we want to reward you with being the first recipients of
            WEAV.
            Brought to you by <a href="https://www.weavr.org/#/0x43240c0f5dedb375afd28206e02110e8fed8cFc0/proposal/21">
            Proposal #21</a>.
            Please ensure that the claim amount to the right is correct.
            It should be 0.1% of the total supply of WEAV that you will recieve at public TGE.
          </p>
        </div>

        <div class="column is-half">
          <div class="is-flex is-flex-direction-column is-align-items-center">
            <div class="box is-border">
              <div class="is-flex is-justify-content-center">
                <div class="p-4">
                  <h4 class="has-text-weight-bold is-size-5">Your share</h4>
                  <div class="is-size-4 has-text-centered">
                    <strong class="has-text-mediumBlue is-size-2">{{ numberFormat.format(amount) }}</strong> WEAV
                  </div>
                </div>
                <div class="p-4">
                  <p class="has-text-weight-bold is-size-5">Total WEAV this Airdrop</p>
                  <div class="is-size-4 has-text-centered">
                    <strong class="has-text-mediumBlue is-size-2">{{ numberFormat.format(airdropBalance) }}</strong>
                    WEAV
                  </div>
                </div>
              </div>
              <div class="is-flex is-justify-content-center my-4">
                <button
                    :class="`has-background-${getBackgroundColor()} button has-text-white has-text-weight-bold is-size-4`"
                    style="min-width: 20ch;" @click="onClaim()">Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-border {
  border: 2px solid gray;
}
</style>

<script>
import {mapGetters} from "vuex";
import ServiceProvider from "../../services/provider";
import {ethers} from "ethers";
import {CONTRACTS} from "@/services/constants";
import Address from "../views/address/Address.vue"

export default {
  name: "Airdrop",
  components: {Address},
  data: () => ({
    amount: 0,
    airdropBalance: 0,
    numberFormat: new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2
    }),
  }),
  computed: {
    ...mapGetters({
      walletAddress: "userWalletAddress",
    }),
    airdropAddress() {
      return this.$route.params["airdropAddress"];
    },
  },
  methods: {
    async refresh() {
      const airdrop = ServiceProvider.airdrop();
      const token = ServiceProvider.token();
      this.amount = ethers.utils.formatEther((await airdrop.viewClaimedAmount(this.walletAddress)));
      this.airdropBalance = ethers.utils.formatEther((await token.getTokenBalance(CONTRACTS.TOKEN_ADDRESS, this.airdropAddress)));
    },
    getBackgroundColor() {
      return parseFloat(this.airdropBalance) === 0 ? "mediumGray" : "mediumBlue";
    },
    onClaim() {
      if (parseFloat(this.airdropBalance) == 0) return;
      this.$router.push("/airdrop/" + this.airdropAddress + "/claim");
    }
  },
  mounted() {
    this.refresh();
  },
}
</script>