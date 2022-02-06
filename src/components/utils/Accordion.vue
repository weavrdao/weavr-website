<template>
  <details
    :class="`${shadow ? 'panel' : ''} m-${margin} p-${padding} 
      ${extraClasses || ''}`"
    v-bind:open="open"
  >
    <summary class="is-clickable">
      <strong>{{ summary }}</strong>
    </summary>
    <slot></slot>
  </details>
</template>

<style scoped>
details {
  max-height: 4rem;
}

details[open] {
  max-height: 10000vh;
}

details[open] > summary {
  margin-bottom: 1rem;
}

details {
  transition-duration: 0.2s;
}

details > summary {
  transition-duration: 0.2s;
}
</style>

<script>
export default {
  name: "Accordion",
  props: {
    summary: {
      type: String,
      required: true,
    },
    shadow: {
      type: Boolean,
      default: true,
    },
    margin: {
      type: Number,
      default: 2,
    },
    padding: {
      type: Number,
      default: 4,
    },
    extraClasses: {
      type: String,
      required: false,
    },
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
};
</script>