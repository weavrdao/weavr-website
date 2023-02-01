<template>
  <div>
    <nav class="navbar p-6" style="z-index: 0;">
      <div class="" v-for="item in routes" :key="item.name">
        <router-link :class="[ isItemCurrent(item) ? 'router-link-active' : '' ]" :to="item.route" >{{item.name}}</router-link>
      </div>
    </nav>
    <div class="box p-5">
      <router-view ></router-view>
    </div>
    
  </div>
</template>
<script>
import { useRoute } from "vue-router"

export default {
  name: "Marketplace",
  data() {
    return {
      routes: [
        {
          name: "Coming Soon",
          route: "/marketplace/coming-soon",
          id: "coming-soon"
        },
        {
          name: "Needles",
          route: "/marketplace/needles"
        },
        {
          name: "Threads",
          route: "/marketplace/threads"
        }
      ]
    }
  },
  methods: {
    isItemCurrent(item) {
      return useRoute().fullPath.includes(item.route)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/weavr-custom.scss";

a {
  border-bottom: 4px transparent solid !important;
  padding: 1rem;
  color: $lightGray;
  margin-right: 0.8rem;
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