<template>
  <div class="columns">
    <div class="columns is-half">
      <img class="card-image" :src="author.avatar" alt="..."/>
    </div>
    <div class="columns is-half">
      <p class="card-header">Written by {{ author.name }}</p>
      <p class="card-bio">{{ author.bio }}</p>
    </div>
  </div>

</template>

<script setup>

const props = defineProps(["author"])
</script>
