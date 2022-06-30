<template>
  <div>
    <HeaderNavigationBar />
    <RouterView class="container p-5" />
 
    <div class="container">
      <section class="columns p-5">
      <div class="column">
        <ProposalListVue proposalStatus="Active Proposals" />
      </div>
      <div class="column">
        <ProposalListVue proposalStatus="Past Proposals" />
      </div>
    </section>
    </div>
 
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
    ProposalListVue,
  },
  computed: {
    ...mapGetters({
      alert: "activeAlert",
    }),
  },
};
</script>