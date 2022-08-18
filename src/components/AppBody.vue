<template>
  <div>
    <HeaderNavigationBar />
    <RouterView class="container p-5" /> 
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderNavigationBar from "./layout/navigation/HeaderNavigationBar.vue";
import ProposalListVue from "./proposals/ProposalList.vue";

export default {
  name: "AppBody",
  components: {
    HeaderNavigationBar,
  },
  computed: {
    ...mapGetters({
      alert: "activeAlert",
    }),
  },
};
</script>