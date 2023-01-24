<template>
  <div class="columns">
    <div class="columns is-half">
      <img class="card-image" :src="author.avatar" alt="..."/>
    </div>
    <div class="columns is-half">
      <p class="card-header">Written by {{ author.name }}</p>
      <VueMarkdown :source="author.bio"/>
    </div>
  </div>

</template>

<script setup>
import VueMarkdown from "vue-markdown-render";

const props = defineProps(["author"])
</script>
