<template>
<div class="container p-5">
  <div class="columns is-desktop is-centered ">
      <div class="column p-5 mt-6 connect-container">
        <h1 class="title has-text-white is-size-1 p-6" >
          Buy, Sell
        <br />and
        <span class="has-text-mediumBlue">Build</span>
        </h1>
      
        <p class="is-size-4">
          
        </p>
        <div class="button is-primary ml-6  is-size-5 " @click="openConnectWalletPage">Authenticate</div>
      </div>
      <div class="column logo-container p-6">
        <div class="image is-fullwidth p-4">
          <img class="p-6" src="../../assets/whitelist-img.png" alt="">
        </div>
      </div>
  </div>
  <div class="box columns has-background-white has-text-darkGray columns p-5 m-3">
    <div class="column is-three-quarters p-3">
      <div class="w-75">
        <h1 class="is-size-3"><b>Gain Access to our Marketplace</b></h1>
      <hr>
      <p class="is-size-5">Join our newsletter and learn to gain your access Weavr</p>
      </div>
      <div class="columns mt-3">
        <div class="column button is-primary is-fullwidth">Suscribe</div>
        <div class="column button  is-secondary ml-3 has-text-white is-fullwidth">Suscribe</div>
      </div>
    </div>
    <div class="column p-5">
      <div class="image">
        <img src="../../assets/envelope.svg" alt="">
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