<template>
  <AppWrapper />
</template>

<script>
import AppWrapper from "./components/AppWrapper";

export default {
  name: "WeavrDAO",
  components: {
    AppWrapper,
  },
  head: {
    link: [
      {
        rel: "icon",
        href: "./assets/favicon.ico"
      }
    ]
  }
};
</script>
