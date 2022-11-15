<template>
  <section class="hero is-large my-0">
    <div class="hero-body" :style="`background-image: url(${src});`"></div>
  </section>
</template>

<style scoped>
.hero-body {
  background-position: center;
  background-size: 100% auto;
  width: 100%;
}
</style>

<script>
export default {
  name: "HeroImage",
  props: {
    src: {
      type: String,
      required: true,
    },
  },
};
</script>