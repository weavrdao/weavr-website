<template>
  <div>
    <div class="container p-5">
      <h3 class="title is-3">Airdrop
        <Address :value="airdropAddress" />
      </h3>
      <div class="columns">
        <div class="column is-half py-4 is-size-5 has-text-white">
          <p>
            Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for
            previewing layouts and visual mockups.
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
                  style="min-width: 20ch;" @click="onClaim">Claim</button>
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
import { mapGetters } from "vuex";
import ServiceProvider from "../../services/provider";
import { ethers } from "ethers";
import { CONTRACTS } from "@/services/constants";
import Address from '../views/address/Address.vue'

export default {
  name: "Airdrop",
  components: { Address },
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
      return this.$route.params['airdropAddress'];
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
      return parseFloat(this.airdropBalance) === 0 ? 'mediumGray' : 'mediumBlue';
    }
  },
  mounted() {
    this.refresh();
  },
  onClaim() {
    if (parseFloat(this.airdropBalance) == 0) return;
    this.$router.push('/airdrop/' + this.airdropAddress + '/claim');
  }
}
</script>
