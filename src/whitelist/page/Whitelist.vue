<template>
<div class="container p-5">
  <div class="columns is-desktop is-centered ">
      <div class="column p-5 mt-6 connect-container">
       <h1 class="title  is-extra-large has-text-white is-large  p-3" >
          Buy, Sell
        <br />and
          <span class="has-text-mediumBlue">Build</span>
        </h1>      
        <!-- <p class="is-size-4"></p> -->
        <div class="columns is-3-desktop">
          <div class="column">
            <div class="
              button 
              is-primary 
              is-fullwidth
              is-size-5 " 
              @click="openConnectWalletPage"
            >
              Authenticate
            </div>
          </div>
          <div class="column">
            <div class="
              button 
              is-secondary 
              is-fullwidth 
              has-text-white  
              is-size-5 " @click="openGuestLogin"
            >
              Enter as Guest
            </div>
          </div>
        </div>
        
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
        <a 
          class="button is-primary"
          href="https://3a567f7a.sibforms.com/serve/MUIEAAkS53zR0h7rhxExKB1X1JotCHaM4o7FBy9qRH3V7h92zXfDojr8PpuqQVRtRIYoeLgWddoOz_IVgW3DofxtESXPIwfentMntmPtVWwU_sTQTpYSt6ESaeVmSheGFH20mDIsMgM1UbzffXQ9ghnsJl8wKxqmH0Lxs7_Ppe1Kd6CVHsywoa4e0jFJBCru4UTyeIdV_z53X2yd"
        >Subscribe
      </a>
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
      guest: "isGuest"
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
    openGuestLogin() {
      this.$router.push("/login")
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