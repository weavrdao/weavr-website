<template>
  <Portal target="#modal-portal-target">
    <div class="modal is-active">
      <div class="modal-background" @click="goBack()"></div>
      <div class="modal-content has-background-darkGray animate__animated animate__fadeInDown animate__faster">
        <component :is="component" v-bind="$attrs" @proposed="goBack()" @submited="() => { isSubmited = true }" />
      </div>
    </div>
  </Portal>
</template>

<script>
import "animate.css";
import { mapActions } from 'vuex';

export default {
  name: "Modal",
  props: ["component", "assetId"],
  data() {
    return {
      isSubmited: false,
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/weavr-custom.scss";

.modal-content {
  border-radius: $card-radius;
}
.close-icon {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 1000px;
    background: rgba(255, 255, 255, 0);
    transition: all 150ms;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }
</style>