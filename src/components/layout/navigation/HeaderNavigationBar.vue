<template>
  <nav class="navbar p-5" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="#">
        <div class="title has-text-white is-flex is-align-items-center">
          <img class="mx-2" src="../../../assets/logo/new-logo.svg" alt="">
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
            'navbar-item',
          ]"
          v-for="item in navigation.items"
          :key="item.name"
          v-on:click="transitTo(item.path)"
        >
          {{ item.name }}
        </a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <SignerAddress />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import SignerAddress from '../../views/address/SignerAddress.vue'
import { useRoute } from 'vue-router'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'HeaderHavigationBar',
  components: {
    SignerAddress,
  },
  data() {
    return {
      navigation: {
        isOpen: false,
        items: [{ name: 'Governance', path: '/#/weavr' }],
      },
    }
  },
  computed: {
    ...mapGetters(['currentNavigationItem']),
  },
  methods: {
    ...mapActions(['goBack']),
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
