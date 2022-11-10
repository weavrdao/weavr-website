<template>
  <div class="loading-container is-flex is-justify-content-center is-flex-direction-column is-align-items-center ">
    <img class="loading-icon" src="../../../assets/logo/new-logo-white.svg" alt="Weavr Icon - Loading">
    <span>{{ message }}</span>
  </div>
</template>
<script>
export default {
  name: "Loading",
  props: {
    message: {
      type: String,
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-container {
  padding: 100px 0;
  gap: 50px;
  span {
    font-size: 1.2rem; }
}

@keyframes fade {
  0%,100% { opacity: 0 }
  50% { opacity: 1 }
}

.loading-icon {
  height: 3rem;
  width: 3rem;
  opacity: 0;
  animation: fade 2.5s ease-in-out infinite;
}
</style>