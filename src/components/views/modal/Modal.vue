<template>
  <Portal target="#modal-portal-target">
    <div class="modal is-active">
      <div class="modal-background" @click="$router.back()"></div>
      <div class="modal-content has-background-darkGray">
        <component :is="component" v-bind="$attrs"/>
      </div>
    </div>
  </Portal>
</template>

<script>
export default {
  name: "Modal",
  props: ["component"],
};
</script>

<style lang="scss" scoped>
@import "../../../styles/frabric-custom.scss";

.modal-content {
  border-radius: $card-radius;
}

</style>