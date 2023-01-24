<template>
  <div class="card card-transparent">
    <div class="card-image">
      <figure class="image is-square">
        <img class="" :src="author.avatar" alt="..."/>
      </figure>
      {{ author.avatar }}
    </div>
    <div class="card-header ">
      <p class="card-header-title">Written by {{ author.name }}</p>
    </div>
    <div class="card-content">
      <div > {{author.bio}} </div>
    </div>
  </div>

</template>

<script setup>

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
