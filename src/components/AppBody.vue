<template>
  <div>
    <HeaderNavigationBar />
    <div v-if="loading" class="is-flex is-justify-content-center" >
      <Loading :message="`Sewing the data`" />
    </div>
    <RouterView class="main container p-5" />
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderNavigationBar from "./layout/navigation/HeaderNavigationBar.vue";
import Footer from "./layout/navigation/Footer.vue";
import Loading from "@/components/views/loading/Loading.vue";

export default {
  name: "AppBody",
  components: {
    HeaderNavigationBar,
    Footer,
    Loading,
  },
  computed: {
    ...mapGetters({
      alert: "activeAlert",
      loading: "isLoading"
    }),
  },
};
</script>

<style lang="scss" scoped>
.main {
  min-height: calc(100vh - 600px);
  margin: 0 auto;
}
</style>