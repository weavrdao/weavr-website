<template>
  <div>
    <nav class="navbar">
      <div class="navlink">
        <router-link class="has-text-lightGray" to="/marketplace">
          <span><unicon class="mr-0" :width="25" :height="25" name="angle-left" fill="darkGray"></unicon></span>
          Coming Soon</router-link>
      </div>
    </nav>
    <router-view id="market"></router-view>
  </div>
</template>
<script>
export default {
    name: "Marketplace",
    
}
</script>