<template>
  <div class="ml-1 mb-4 is-flex is-align-items-center">
    <div>
      <span class="asset">ASSET</span>
      <a :href="`https://goerli.etherscan.io/address/${address}`"
          target="_blank"
          class="address">
      {{ address || "No asset selected" }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "StackNavigationBar",
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  methods: {
    goBack() {
      this.$emit("onBack");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/frabric-custom.scss";

.back-arrow {
  height: 1.5rem;
  width: 1.5rem;
  transition: 150ms ease-in-out;
  transform: translateX(0px);
  margin-right: 20px;
  &:hover {
    transform: translateX(-4px);
  }
}

.asset {
  padding: 5px 10px;
  color: white;
  background: $mediumBlue;
  border-radius: $tiny-radius 0 0 $tiny-radius;
}

.address {
  padding: 5px 10px;
  color: $mediumBlue;
  background: $darkGray;
  border-radius: 0 $tiny-radius $tiny-radius 0;
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    color: $mediumBlue !important;
    filter: brightness(120%);
  }
}

* {
  font-weight: 600;
}
</style>