<template>
  <Portal target="#modal-portal-target">
    <div class="modal is-active">
      <div class="modal-background" @click="goBack()"></div>
      <div class="modal-content has-background-darkGray animate__animated animate__fadeInDown animate__faster">
        <PulseLoader></PulseLoader>
        <component :is="component" v-bind="$attrs" @proposed="goBack()" @submited="() => { isSubmited=true }" v-show="!isSubmited"/>
      </div>
    </div>
  </Portal>
</template>

<script>
import "animate.css";
import PulseLoader from "vue-spinner/src/PulseLoader.vue"
import { DAO } from "../../../services/constants";
import { mapActions } from 'vuex';
export default {
  name: "Modal",
  components: [PulseLoader],
  props: ["component"],
  data(){
    return {
      isSubmited: false,
    }
  },
  methods: {
    ...mapActions({
      refresh: ""
    }),
    goBack() {
      this.$router.push("/".concat(DAO)).then(() => this.$router.go())
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/frabric-custom.scss";

.modal-content {
  border-radius: $card-radius;
}

</style>