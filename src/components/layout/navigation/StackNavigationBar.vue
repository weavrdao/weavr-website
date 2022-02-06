<template>
  <div class="mb-4">
    Viewing <strong><slot></slot></strong> (<a
      href="javascript:void(0)"
      v-on:click="goBack"
      >Back to previous page</a
    >)
  </div>
</template>

<script>
export default {
  name: "StackNavigationBar",
  methods: {
    goBack() {
      this.$emit("onBack");
    },
  },
};
</script>