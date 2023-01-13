<template>
  <div>
  <div class="container p-5">
    <!-- todo: styling -->
    <p class="title is-3">Airdrop {{airdropAddress}}</p>
    <p class="getClaimableAmount">Current Claimable Amount</p>
    <p  class="has-text-mediumBlue is-size-4">{{amount}} WEAV</p>
    <button v-if="airdropBalance===0" class="button has-background-mediumGray has-text-white">Claim</button>
    <button v-else class="button has-background-mediumBlue has-text-white" @click="claim">claim</button>
  </div>
  <div class="container p-5">
    <p>Currently Available WEAV in Airdrop SC</p>
    <p class="has-text-mediumBlue is-size-4">{{airdropBalance}} WEAV</p>
  </div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import ServiceProvider from "../../services/provider";
import {ethers} from "ethers";
import {CONTRACTS} from "@/services/constants";
export default {
  name: "Airdrop",
  data: () => ({
    amount: 0,
    airdropBalance: 0,
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
      this.airdropBalance = ethers.utils.formatEther((await token.balanceOf(this.airdropAddress)));
    },
    async claim() {
      const airdrop = ServiceProvider.airdrop();
      await airdrop.claim();
    }
  },
  mounted() {
    this.refresh();
  }
}
</script>
