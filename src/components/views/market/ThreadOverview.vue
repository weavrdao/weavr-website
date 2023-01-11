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
      return this.threads
        .find(n => n.id === this.threadId);
    },
  },
  mounted() {
    console.log(this.threads)
  }

}
</script>

<style>

</style>