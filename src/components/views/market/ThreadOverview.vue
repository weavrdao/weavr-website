<template>
  <div class="box">
    {{thread}}
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";


export default {
  name: "ThreadOverview",
  components: [ ],
  data() {
    return {
      threadId: this.$route.params.threadId.toLowerCase()
    }
  },
  computed: {
    ...mapGetters({
      threads: "allThreads",

    }),
    thread() {
      console.log("THREADS_OVERVIEW: ", this.threads);
      return this.threads
        .find(n => n.id === this.threadId);
    },
  },
  methods: {
    ...mapActions({
      fetchThreads: "refreshThreads",
    })
  },
  mounted() {
    console.log(this.threads)
    // this.fetchThreadTokenData({
    //   assetId: this.threadId,
    // })
  }

}
</script>

<style>

</style>