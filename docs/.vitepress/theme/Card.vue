<template>
  <div class="columns" v-if="author.name !=='...'">
    <div class="columns is-half">
      <img class="card-image" :src="author.avatar" alt="..."/>
    </div>
    <div class="columns is-half">
      <p class="card-header">Written by {{ author.name }}</p>
      <p> {{ author.bio }} </p>
    </div>
  </div>

</template>

<script setup>
import {onMounted} from "vue";
import {useData} from "vitepress";

const {frontmatter} = useData()

function getAuthor(author, frontData) {
  if (frontData.author) {
    author.name = frontData.author
    author.bio = frontData.bio
    author.avatar = frontData.avatar
  }
}

const props = defineProps(["author"])

onMounted(() => {
  console.log("mounted card")
  getAuthor(props.author, frontmatter.value)
})
</script>
