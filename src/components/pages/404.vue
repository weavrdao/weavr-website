<template>
  <div class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
    <img src="../../assets/common/404.svg" alt="Page not found">
    <h2 class="has-text-mediumBlue">Sorry, we couldn't find this page</h2>
    <button class="button has-background-mediumBlue has-text-white p-5" @click="routeToHome">Return Home</button>
  </div>
</template>

<script>
export default {
  name: "PageNotFound",
  methods: {
    routeToHome() {
      this.$router.push("/");
    }
  }
}
</script>

<style scoped>
img {
  height: 40rem;
  width: 40rem;
}

h2 {
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 5rem;
}
</style>
