<template>
  <div class="app-background bg-purple-black">
  </div>
</template>

<script>
export default {
  name: "Background",
}
</script>

<style scoped>
.app-background {
  position: fixed;
  top: 0;
  left: calc(-100vw / 2);
  right: 0;
  pointer-events: none;
  /* max-width: 100vw !important; */
  width: 200vw;
  height: 200vh;
  mix-blend-mode: color;
  transform: translateY(-100vh);
  will-change: background;
  transition: background 450ms ease;
}
</style>