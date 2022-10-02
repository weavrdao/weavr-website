<template>
<div class="container flex-center">
    <div class="is-flex is-flex-direction-column is-centered mb-5 logo-container">
      <img class="image is-128x128" src="../../assets/logo/new-logo.svg" alt="Weavr logo">
      <h3 class="title has-text-white">WEAVR</h3>
    </div>
    <div class="flex-center connect-container">
      <h3 v-if="!address">Please connect your wallet to continue</h3 >
      <button class="button tag is-primary has-radius-xs is-large is-clickable " v-if="!address" @click="openConnectWalletPage">Connect Wallet</button>
      <button class="button tag is-primary has-radius-xs is-large is-clickable " v-else-if="whitelisted" @click="continueToHomepage">Continue to Homepage</button>
      <div class="flex-center" v-else>
        <h3>We're sorry, you have not yet been whitelisted</h3>
        <p>You are not currently able to access this application</p>
      </div>
    </div>
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
    continueToHomepage () {
      this.$router.push("/weavr");
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../../styles/_variables.sass";
@import "../../styles/frabric-custom.scss";

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo-container {
  opacity: 0;
  animation: fadeIn ease 1s forwards;
  animation-delay: 0.2s;
}

.connect-container {
  opacity: 0;
  animation: fadeIn ease 1s forwards;
  animation-delay: 0.55s;
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}
</style>