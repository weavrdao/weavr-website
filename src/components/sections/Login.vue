<template>
<div>
    <div class="cointainer p-5">
        <div class="close-icon" @click="routeToHome">
             <unicon
                class="is-flex is-align-self-center" 
                name="times" 
                fill="lightGray"
                hoverFill="lightGray-invert"
            >
            </unicon>
        </div>
        <div class="is-flex is-justify-content-space-evenly">
            <div class="form">
              <div class="label field is-size-4">Enter Guest Password</div>
              <input class="input field" type="password" v-model="passwd"/>
              <div class="button is-primary" @click="onClick">Login</div>
            </div>
        </div>
    </div>
</div>    
</template>
<script>
// import {mapActions}
import { mapActions, mapGetters } from "vuex"
import { DAO } from "@/services/constants.js"

export default {
  name: "Login",
  computed: {
    ...mapGetters({
      guestCookie: "guestCookie",
    }),
    isGuest() {
      return this.guestCookie
    },
    hover: false,
  },
  data() {
    return {
     passwd: ""
    }
  },
  methods: {
    ...mapActions({
      login: "connectGuest",
      
    }),
    async onClick() {
      this.$toast.show("Checking for password ");
      console.log(this.isGuest)
      await this.login({passwd: this.passwd}).then( (LOOGED) => {
        console.log(this.isGuest)
      if(LOOGED){
        this.$router.push("/".concat(DAO))
      }
      })
      // this.sync({ wallet: wllt, $toast: this.$toast})
      //   .then(() => {
      //     this.routeToHome();
      //   });
      
      
    },
    routeToHome() {
      this.$router.push("/".concat(DAO));
    },
  }    
}
</script>

<style lang="scss" scoped>
@import "@/styles/frabric-custom.scss";

.wallet-box :hover {
  background-color: $mediumDarkGray;
}

.disabled {
  opacity: 0.4;
}

.close-icon {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  justify-content: center;
  vertical-align: middle;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 1000px;
  background: rgba(255, 255, 255, 0);
  transition: all 150ms;
  cursor: pointer;

  &:hover {
    background: $red;
    
  }
}
</style>