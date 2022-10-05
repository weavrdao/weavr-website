<template>
 <div class="container p-5 is-dark">
  <div class="columns is-desktop is-centered  ">
      <div class="column p-5 mt-6 connect-container">
        <h1 class="title has-text-white is-size-1 p-6" >
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
          <img class="p-6" src="../../assets/hero-image.svg" alt="">
        </div>
      </div>
  </div>
  <div class="columns">
      <div class="column is-full has-text-lightGray">
        <p class="title">Real Estate membership community for everyone</p>
      </div>
  </div>
  <div class="box columns has-text-white p-5 m-3">
    
    
   
  </div>
</div>
</template>

<style scoped>
.content.is-vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center; /* used this for multiple child */
}

.columns {
   /* Bulma uses negative margin and ruins alignment  */
  margin-left: unset !important;
  margin-right: unset !important;
  margin-top: 1.5rem;
  gap: 1.5rem;
}
</style>

<script>

export default {
  name: "Homepage",
  

  methods: {

    goBack() {
      this.$router.back();
    }, 
  }
};
</script>