<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from "vitepress/theme"
import Card from "./Card.vue"
import {onBeforeMount, reactive, ref} from "vue"
import {useData} from "vitepress";

const {frontmatter} = useData()

const {Layout} = DefaultTheme

let author = reactive({});

function getAuthor(frontData) {
  if (frontData.author) {
    return {
      name: frontData.author,
      bio: frontData.bio,
      avatar: frontData.avatar
    }
  } else {
    return {
      name: "Unknown",
      bio: "Unknown",
      avatar: "https://i.imgur.com/0Z0Z0Z0.png"
    }
  }
}

onBeforeMount(() => {
  author.value = getAuthor(frontmatter.value)
})
</script>
<template>
  <Layout>
    <template #aside-top>
      <Card :author="author.value"/>
      <div class="line"></div>
    </template>
  </Layout>
</template>