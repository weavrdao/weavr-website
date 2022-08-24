<template>
  <Portal target="#modal-portal-target">
    <div class="modal is-active">
      <div class="modal-background" @click="$router.back()"></div>
      <div class="modal-content has-background-darkGray animate__animated animate__fadeInDown animate__faster">
        <component :is="component" v-bind="$attrs"/>
      </div>
    </div>
  </Portal>
</template>

<script>
import "animate.css";

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