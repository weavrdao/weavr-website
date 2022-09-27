<template>
  <a :href="`https://arbiscan.io/address/${value}`" target="_blank" rel="noopener" class="tag is-mediumBlue is-medium is-clickable has-radius-lg">
    <span class="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </span>
    <span class="is-family-monospace" v-bind:title="address">
      {{
        address.substring(0, 8) + "..." + address.substring(address.length - 4)
      }}
    </span>
  </a>
</template>

<script>
export default {
  name: "Address",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      address: "",
    };
  },
  created() {
    this.address = this.value;
  },
};
</script>

<style scoped lang="scss">
.tag {
  transition: all 150ms;
  text-decoration: none !important;
  &:hover {
    filter: contrast(120%);
  }
}
</style>