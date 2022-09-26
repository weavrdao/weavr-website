<template>
  <nav class="navbar p-5" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
        <div class="title has-text-white is-flex is-align-items-center">
          <img class="mx-2" src="../../../assets/logo/new-logo.svg" alt="">
          <h1>Weavr</h1>
          <span> Resolutions</span>
        </div>
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'HeaderHavigationBar',
}
</script>

<style lang="scss" scoped>
@import "../../../styles/frabric-custom.scss";

.navbar {
  background-color: transparent !important;
}

.title {
  font-weight: 400;
  display: flex;
  align-items: flex-end;

  span {
    font-size: 1rem;
    margin-left: 1rem;
    margin-top: 10px;
  }
}
</style>
