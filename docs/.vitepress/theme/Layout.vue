<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from "vitepress/theme"
import Card from "./Card.vue"
import {reactive, watch} from "vue"
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
    return null
  }
}

watch(() => frontmatter, (frontData) => {
  author.value = getAuthor(frontData)
})


</script>
<template>
  <Layout>
    <template v-if="author.value !== null" #aside-top>
      <Card :author="author.value"/>
    </template>
  </Layout>
</template>