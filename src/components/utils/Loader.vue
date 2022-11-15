<template>
  <div
    :class="`
      card
      m-${margin}
      p-${padding}
      ${shadowless ? 'is-shadowless' : ''}
      is-flex is-large is-justify-content-center is-align-items-center
    `"
  >
    <div class="loader is-large is-loading"></div>
  </div>
</template>

<style scoped>
.loader.is-large {
  width: 3rem;
  height: 3rem;
  border-width: 0.2rem;
}
</style>

<script>
export default {
  name: "Loader",
  props: {
    margin: {
      type: Number,
      default: 0,
    },
    padding: {
      type: Number,
      default: 4,
    },
    shadowless: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
};
</script>