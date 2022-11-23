<template>
  <div>
    <!-- <nav class="navbar">
      <div class="navlink">
        <router-link class="has-text-lightGray" to="/marketplace">
          <span><unicon class="mr-0" :width="25" :height="25" name="angle-left" fill="darkGray"></unicon></span>
          </router-link>
      </div>
    </nav> -->
    <div class="box p-5">
      <router-view></router-view>
    </div>
    
  </div>
</template>
<script>
export default {
    name: "Marketplace",
    mounted() {
      this.$router.push({name: "comingSoon"})
    },
    
}
</script>

<style scoped>
  .nav {
    z-index: -9999;
  }
</style>