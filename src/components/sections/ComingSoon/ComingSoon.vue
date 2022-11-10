<template>
<div class="has-text-white">
    <div class="cover-image-container">
      <h3>Upcoming Properties</h3>
    </div>
    <div class="needles-container mt-5">
      <div v-for="property in this.properties" :key="property.id">
        <ComingSoonListItem :property="property" />
      </div>
    </div>
</div>
</template>
<script>
import ComingSoonListItem from "./ComingSoonListItem.vue";
import properties from "./properties";

export default {
  name: "ComingSoon",
  components: {
    ComingSoonListItem,
  },
  data() {
    return {
      properties,
    }
  }
}
</script>
<style scoped lang="scss">
.cover-image-container {
  position: relative;
  background-image: linear-gradient(to left, rgba(22, 23, 30, 0), rgba(22, 23, 30, 0.5)), url("../../../assets/pics/upcoming-banner.png");
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