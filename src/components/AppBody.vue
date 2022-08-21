<template>
  <div>
    <HeaderNavigationBar />
    <RouterView class="container p-5" />
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