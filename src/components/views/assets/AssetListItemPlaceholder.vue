<template>
  <section aria-labelledby="asset-title" class="panel p-4">
    <div class="has-text-centered">
      <div>Your Next Asset Will Be Here</div>
      <Button
        label="Go to Marketplace"
        extraClasses="mt-4"
        @click="openMarketplace"
      />
    </div>
  </section>
</template>

<script>
import Button from "../common/Button.vue";

export default {
  name: "AssetListItemPlaceholder",
  components: {
    Button,
  },
  methods: {
    openMarketplace() {
      this.$router.push("/market");
    },
  },
};
</script>