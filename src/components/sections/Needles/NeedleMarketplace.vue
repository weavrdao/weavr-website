<template>
  <div class="has-text-white has-radius-lg">
    <div class="cover-image-container">
      <h3>Needles</h3>
    </div>
    <div v-if="loading" class="is-flex is-justify-content-center" >
      <Loading :message="`Loading needles`" />
    </div>
    <div class="is-flex is-justify-content-center is-align-items-center mt-5 pt-5" v-else-if="this.needles.length === 0">
      No needles have been created yet
    </div>
    <div v-else class="needles-container mt-5">
      <div v-for="needle in this.needles" :key="needle.id">
        <NeedleMarketListItem :needle="needle" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import NeedleMarketListItem from "./NeedleMarketListItem.vue"
import Loading from "../../views/loading/Loading.vue";

export default {
  name: "NeedleMarketplace",
  components: {
    NeedleMarketListItem,
    Loading,
  },
  computed: {
    ...mapGetters({
      needles: "allNeedles",
    }),
    loading() {
      return this.needles === null;
    }
  },
  methods: {
    ...mapActions({
      getNeedles: "refreshNeedles",
      syncWallet: "syncWallet",
    }),
    filterNeedles(needles) {
      return needles.filter((needle) => !!needle.imageHashes)
    }
  },
  mounted() {
    this.getNeedles();
    this.syncWallet({ $toast: this.$toast });
  },
  watch: {
    $route: "refresh",
  },
};
</script>

<style scoped lang="scss">
@import "../../../styles/frabric-custom.scss";
@import "../../../styles/_variables.sass";

.needles-container {
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
