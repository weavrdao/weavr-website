<template>
  <div>
    <nav class="navbar">
      
      <router-link to="/marketplace/needles" >Needles</router-link>
      
      
      <router-link to="/marketplace/threads" >Threads</router-link>  
        
      <router-link to="/marketplace/coming-soon" >Coming Soon</router-link>
        
      

      
    </nav>
    <div class="box p-5">
      <router-view ></router-view>
    </div>
    
  </div>
</template>
<script>
export default {
  name: "Marketplace",  
}
</script>

<style lang="scss" scoped>
@import "../../styles/weavr-custom.scss";

a {
  border-bottom: 4px transparent solid !important;
  padding: 1rem;
  color: $lightGray;
  &:hover {
    color: $white;
    border-color:$white !important;
  }
}
.router-link-active {
  color: $lightBlue;
  border-color: $lightBlue !important;
  background: transparent;
}
  
  
</style>