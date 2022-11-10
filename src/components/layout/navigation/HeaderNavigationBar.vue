<template>
  <nav class="navbar p-5" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
      <a class="navbar-item" href="#">
        <div class="title brand has-text-white is-flex is-align-items-center">
          <div class="image p-2"><img class="mx-2" src="../../../assets/logo/new-logo.svg" alt=""></div>
          Weavr</div>
      </a>

      <a
        role="button"
        ref="menuButton"
        :class="[
          navigation.isOpen ? 'is-active' : '',
          'navbar-burger',
          'has-border-bottom',
        ]"
        @click="menuToggle()"
        aria-label="menu"
        aria-expanded="false"
        data-target="frabric-navbar"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div :class="[navigation.isOpen ? 'is-active' : '', 'navbar-menu']">
      <div class="navbar-start">
        <a
          :class="[
            isItemCurrent(item) ? 'has-border-bottom' : '',
            'navbar-item navlink',
            '',
            'p-3 mt-2 is-primary'
          ]"
          v-for="item in navigation.items"
          :key="item.name"
          v-on:click="transitTo(item.path)"
          :href="item.path"
        >
          {{ item.name }}
        </a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <!-- <SignerAddress /> -->
        </div>
      </div>
    </div>
    </div>
    
  </nav>
</template>

<script>
// import SignerAddress from '../../views/address/SignerAddress.vue'
import { useRoute } from "vue-router"
import { mapGetters, mapActions } from "vuex"
export default {
  name: "HeaderHavigationBar",
  components: {
    // SignerAddress,
  },
  data() {
    return {
      navigation: {
        isOpen: false,
        items: [
          {name: "Marketplace", path: "https://app.weavr.org/marketplace" },
          { name: "Governance", path: "https://app.weavr.org/gov" },
          { name: "Resolutions", path: "https://resolutions.weavr.org" }],
      },
    }
  },
  computed: {
    ...mapGetters(["currentNavigationItem"]),
  },
  methods: {
    ...mapActions(["goBack"]),
    isItemCurrent(item) {
      return item.path == useRoute().path
    },
    transitTo(path) {
      this.$router.push(path)
      this.menuToggle()
    },
    menuToggle() {
      this.navigation.isOpen = !this.navigation.isOpen
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../../styles/frabric-custom.scss";

.navbar {
  background-color: transparent !important;
}

.title {
  font-weight: 400;
}

.is-selected {
  color: $mediumBlue;
}

.navlink {
  margin: 0 10px;
  font-weight: 600;
  border-radius: $tiny-radius;
  transition: all 150ms;

  &:hover {
    color: white !important;
    background: $mediumBlue !important;
  }
}
</style>
