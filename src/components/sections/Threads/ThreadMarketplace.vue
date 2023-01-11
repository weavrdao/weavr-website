<template>
  <div class="has-text-white has-radius-lg">
    <div class="cover-image-container">
      <h3>Threads</h3>
    </div>
    <div v-if="loading" class="is-flex is-justify-content-center" >
      <Loading :message="`Loading threads`" />
    </div>
    <div class="is-flex is-justify-content-center is-align-items-center mt-5 pt-5" v-else-if="this.threads.length === 0">
      <h2 class="title">No threads have been created yet</h2>
    </div>
    <div v-else class="threads-container mt-5">
      <div v-for="thread in this.threads" :key="thread.id">
        <ThreadMarketListItem :thread="thread" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ThreadMarketListItem from "./ThreadMarketListItem.vue"
import Loading from "../../views/loading/Loading.vue";

export default {
  name: "ThreadMarketplace",
  components: {
    ThreadMarketListItem,
    Loading,
  },
  computed: {
    ...mapGetters({
      threads: "allThreads",
    }),
    loading() {
      return this.threads === null;
    }
  },
  methods: {
    ...mapActions({
      getThreads: "refreshThreads",
    }),
    filterThreads(threads) {
      return threads.filter((thread) => !!thread.imageHashes)
    }
  },
  mounted() {
    // this.getThreads();
  },
};
</script>

<style scoped lang="scss">
@import "../../../styles/weavr-custom.scss";
@import "../../../styles/_variables.sass";

.threads-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 0px;

  @media screen and (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.cover-image-container {
  position: relative;
  background-image: linear-gradient(to left, rgba(22, 23, 30, 0), rgba(22, 23, 30, 0.3)), url("../../../assets/pics/needlecoverimage.png");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  border-radius: 12px;
  height: 300px;

  h3 {
    position: absolute;
    top: 1rem;
    left: 1.5rem;
    font-weight: 600;
    font-size: 2rem;
  }

  img {
    object-fit: cover;
    object-position: center;
    height: 100%;
  }
}
</style>
