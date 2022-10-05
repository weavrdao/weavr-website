<template>
  <div  class="container p-5 is-dark">
    <div class="container">
      <div class="box">
        askjasdklasj
        adklsdakladsj
        kdasjdaslkdasj
        kladsjsadlkjds
      </div>
    </div>
  </div>
</template>

<style scoped>
.content.is-vcentered {
  display: flex;
  flex-wrap: wrap;
  align-content: center; /* used this for multiple child */
}

.columns {
   /* Bulma uses negative margin and ruins alignment  */
  margin-left: unset !important;
  margin-right: unset !important;
  margin-top: 1.5rem;
  gap: 1.5rem;
}
</style>

<script>

export default {
  name: "Homepage",
  

  methods: {

    goBack() {
      this.$router.back();
    }, 
  }
};
</script>