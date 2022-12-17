<template>
  <nav class="navbar  p-5" role="navigation" aria-label="main navigation">
    <div class="container ">
      <div class="navbar-brand">
        <a class="navbar-item" @click="transitTo('/')">
          <div class="title brand has-text-white is-flex is-align-items-center" >
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
            isItemCurrent(item) ? 'active-link' : '',
            'navbar-item navlink',
            '',
            'p-3 mt-2 is-primary'
          ]"
              v-for="item in navigation.items"
              :key="item.name"
              v-on:click="transitTo(item.route)"
          >
            {{ item.name }}
            <span v-if="item.icon">
            <unicon width="15" height="15" :name="item.icon" fill="gray"></unicon>
          </span>
          </a>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <SignerAddress />
          </div>
        </div>
      </div>
    </div>

  </nav>
</template>

<script>
import SignerAddress from "../../views/address/SignerAddress.vue"
import { useRoute } from "vue-router"
import { mapGetters, mapActions } from "vuex"
import { CONTRACTS, DAO } from "../../../services/constants"
export default {
  name: "HeaderHavigationBar",
  components: {
    SignerAddress,
  },
  data() {
    return {
      navigation: {
        isOpen: false,
        items: [
          { name: "Governance", route: `/${CONTRACTS.WEAVR}`},
          { name: "Marketplace", route: "/marketplace"},
          { name: "Resolutions", route: "/resolutions", icon: "arrow-up-right"},
          { name: "FAQ", route: "/faq", icon: "arrow-up-right" },
          { name: "Forums", route: "/forums", icon: "arrow-up-right" }
        ],
      },
    }
  },
  computed: {
    ...mapGetters(["currentNavigationItem"]),
  },
  methods: {
    ...mapActions(["goBack"]),
    isItemCurrent(item) {
      return true;
      // return useRoute().fullPath.includes(item.route)
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
@import "../../../styles/weavr-custom.scss";

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

.active-link {
  background: linear-gradient(to top,  rgba(255,255,255,0) 20%,$mediumBlue 100%);
}
</style>