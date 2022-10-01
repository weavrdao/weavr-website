<template>
<div>
    <h3>Welcome to WEAVR</h3>
    <p>Please connect your wallet to continue</p>
    <button v-if="!!address" @click="checkWhitelisted">Check whitelist status</button>
    <button v-else @click="openConnectWalletPage">Connect Wallet</button>
</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Whitelist",
  computed: {
    ...mapGetters({
      address: "userWalletAddress",
      whitelisted: "isWhitelisted",
    })
  },
  props: {
    assetId: {
      type: String,
    },
  },
  methods: {
    ...mapActions({
      checkWhitelisted: "checkWhitelistStatus"
    }),
    openConnectWalletPage () {
      console.log("testing");
      this.$router.push("/walletConnect")
    },
    async checkWhitelist() {
      const whitelisting = await this.checkWhitelisted();
      Promise.all([whitelisting]);
      if(this.whitelisted) {
        this.$router.push("/whatever");
      }
    }
  },
  mounted() {
    this.checkWhitelist();
  }
}
</script>