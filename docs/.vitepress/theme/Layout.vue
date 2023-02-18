<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from "vitepress/theme"
import Card from "./Card.vue"
import {reactive} from "vue"

const {Layout} = DefaultTheme

let author = reactive({
  name: "...",
  bio: "...",
  avatar: "..."
});


</script>
<template>
  <Layout>
    <template #aside-bottom>
      <Card :author="author"/>
    </template>
  </Layout>
</template>

<style>

</style>