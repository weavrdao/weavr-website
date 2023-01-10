<template>
  <div class="box">
    {{thread}}
  </div>
</template>

<script>


export default {
  name: "ThreadOverview",
  components: [ ],
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  mounted() {

  }

}
</script>

<style>

</style>