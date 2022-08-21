<template>
  <div>
    <HeaderNavigationBar />
    <RouterView class="main container p-5" />
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderNavigationBar from "./layout/navigation/HeaderNavigationBar.vue";
import Footer from "./layout/navigation/Footer.vue";

export default {
  name: "AppBody",
  components: {
    HeaderNavigationBar,
    Footer,
  },
  computed: {
    ...mapGetters({
      alert: "activeAlert",
    }),
  },
};
</script>

<style lang="scss" scoped>
.main {
  min-height: calc(100vh - 600px);
}
</style>