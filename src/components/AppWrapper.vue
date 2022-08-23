<template>
  <div>
    <Background />
    <AppBody />
    <div id="modal-portal-target"></div>
  </div>
</template>

<script>
import Background from "./Background.vue";
import AppBody from "./AppBody";

export default {
  name: "AppWrapper",
  components: {
    Background,
    AppBody,
  },
};
</script>