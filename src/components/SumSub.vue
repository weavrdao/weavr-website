<template>
  <div>

    <div class="container p-5">
      <div class="is-size-4 mt-4"><h2>Become a Member</h2></div>
      <div class="tag is-primary">
        <div class="is-size-7">{{externalUserID}}</div>
      </div>


      <div class="control mt-4 is-flex is-flex-direction-column">
        <div class="button is-success is-flex is-align-self-flex-end" v-if="userAccessToken && !verification" @click="launchWebSdk">Proceed to verification</div>
        <div id="sumsub-websdk-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';
import { getAccessToken } from '../sumsub';
import { mapGetters } from 'vuex';

export default {
  name: "SumSub",
  data() {
    return {
      userAccessToken: "",
      userID: "",
      verification: false
    }
  },
  computed: {
    ...mapGetters({
      userWallet: "userWalletAddress"
    }),
    externalUserID() {
      return this.userWallet.slice(2)
    },
  },
  methods: {
    launchWebSdk() {
      let snsWebSdkInstance = snsWebSdk.init(
          this.userAccessToken,
          () => Promise.resolve(null)
      )
          .withConf({
            lang: 'en', //language of WebSDK texts and comments (ISO 639-1 format)
            uiConf: {
              customCssStr: `:root {\n  --black: #000000;\n   --grey: #F5F5F5;\n  --grey-darker: #B2B2B2;\n  --border-color: #DBDBDB;\n}\n\np {\n  color: var(--black);\n  font-size: 16px;\n  line-height: 24px;\n}\n\nsection {\n  backgorund-color: transparent !important; \n margin: 40px auto;\n}\n\ninput {\n  color: var(--black);\n  font-weight: 600;\n  outline: none;\n}\n\nsection.content {\n  background-color: var(--grey);\n  color: var(--black);\n  padding: 40px 40px 16px;\n  box-shadow: none;\n  border-radius: 6px;\n}\n\nbutton.submit,\nbutton.back {\n  text-transform: capitalize;\n  border-radius: 6px;\n  height: 48px;\n  padding: 0 30px;\n  font-size: 16px;\n  background-image: none !important;\n  transform: none !important;\n  box-shadow: none !important;\n  transition: all 0.2s linear;\n}\n\nbutton.submit {\n  min-width: 132px;\n  background: none;\n  background-color: var(--black);\n}\n\n.round-icon {\n  background-color: var(--black) !important;\n  background-image: none !important;\n}`
            },
          })
          .build();
      snsWebSdkInstance.launch('#sumsub-websdk-container')
      this.verification = true
    },
  },

  beforeMount() {
    const x =  getAccessToken(this.userWallet)
    Promise.resolve(x).then(
        resp => {
          console.log("this and that", resp.data)
          this.userAccessToken = resp.data.token
        }
    )
  },
}
</script>
