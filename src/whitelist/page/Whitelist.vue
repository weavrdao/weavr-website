<template>
<div>
    <h3>Welcome to WEAVR</h3>
    <p>Please connect your wallet to continue</p>
    <button @click="openConnectWalletPage">Connect Wallet</button>
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
      this.$router.push("/walletConnect")
    },
  },
}
</script>