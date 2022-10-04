<template>
<div class="container">
<div class="columns is-desktop is-centered">
    <div class="column p-5">
      <h1 class="title has-text-white is-size-1">
        Buy, Sell
      <br />and
      <span class="has-text-mediumBlue">Build</span>
      </h1>
     
      <p class="is-size-4">
        The first totally decentralized Real estate market. Invest in
                    tokenized Real Estate, Manage it, earn, and sell anytime.
      </p>
       <div class="button is-primary mt-3 is-size-5">Authenticate</div>
    </div>
    <div class="column">
      <div class="image">
        <img src="../../assets/whitelist-img.png" alt="">
      </div>
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