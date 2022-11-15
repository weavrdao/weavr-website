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
import StringCrypto from "string-crypto"
import { getAccessToken, style } from '../sumsub';
import { mapGetters } from 'vuex';


const options = {
  salt: '2f0ijf2039j23r09j2fg45o9ng98um4o',
  iterations: 10,
  digest: 'sha512', // one of: 'blake2b512' | 'blake2s256' | 'md4' | 'md5' | 'md5-sha1' | 'mdc2' | 'ripemd160' | 'sha1' | 'sha224' | 'sha256' | 'sha3-224' | 'sha3-256' | 'sha3-384' | 'sha3-512' | 'sha384' | 'sha512' | 'sha512-224' | 'sha512-256' | 'sm3' | 'whirlpool';
};

const SALT = process.env.VUE_APP_SUMSUB_SALT

const sc = new StringCrypto({
  salt: 'WEAVR',
  iterations: 1,
  digest: 'sm3',
});


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


              // URL to css file in case you need change it dynamically from the code
              // the similar setting at Customizations tab will rewrite customCss
              // you may also use to pass string with plain styles `customCssStr:`
            },
          })
          .build();
      snsWebSdkInstance.launch('#sumsub-websdk-container')
      this.verification = true
    },

  },
  created() {

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
  mounted() {
  }
}
</script>

<style>

</style>

