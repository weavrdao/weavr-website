<template>
  <div class="card card-transparent">
    <div class="card-image">
      <figure class="image is-square">
        <img class="" :src="author.avatar" alt="..."/>
      </figure>
      
    </div>
    <div class="card-header ">
      <p class="card-header-title">Written by {{ author.name }}</p>
    </div>
    <div class="card-content">
      <VueMarkdown :source="author.bio"/>
    </div>
  </div>

</template>

<script setup>
import VueMarkdown from "vue-markdown-render";

const props = defineProps(["author"])
</script>

<style lang="scss">
@import "../../../src/styles/weavr-custom.scss";
.card-transparent {
  background: transparent !important;
}
:root {
  --vp-c-doc: #646cff;
  --vp-c-brand-light: #747bff;
}
</style>
