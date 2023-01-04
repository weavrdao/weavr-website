<template>
  <div>
    <HeaderNavigationBar />
    <!-- <div v-if="loadingState.isLoading" class=" main is-flex is-justify-content-center" style="min-height='80vh;'">
      <Loading :message="loadingState.message || 'loading'" />
    </div> -->
  <div v-if="loadingState.isLoading" class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
    <!-- Any other Bulma elements you want -->
          <Loading :message="loadingState.message || 'loading'" />
    </div>
  </div>
    <RouterView  class="main container p-5" />
    <Footer />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderNavigationBar from "./layout/navigation/HeaderNavigationBar.vue";
import Footer from "./layout/navigation/Footer.vue";
import Loading from "@/components/views/loading/Loading.vue";
import Modal from "@/components/views/modal/Modal.vue"
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
      loadingState: "loadingState"
    }),
  },
};
</script>

<style lang="scss" scoped>
.main {
  min-height: calc(100vh - 600px) !important;
  margin: 0 auto;
}
</style>