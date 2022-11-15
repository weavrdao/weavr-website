<template>
  <div class="w-full max-w-screen mx-auto flex flex-col items-center">
    <div
      class="
        max-w-3xl
        mt-8
        bg-level-1-light
        opacity-95
        shadow-lg
        overflow-hidden
        rounded-lg
      "
    >
      <div class="px-8 py-8">
        <form class="h-full" action="#">
          <div class="h-full shadow rounded-lg">
            <div class="h-full flex flex-col justify-between space-y-8">
              <div class="flex flex-col space-y-8">
                <div>
                  <div class="flex flex-row items-center justify-between">
                    <label
                      for="company-website"
                      class="
                        block
                        text-sm
                        font-medium
                        text-foam text-opacity-50
                      "
                    >
                      From
                    </label>
                    <label
                      for="company-website"
                      class="block text-sm font-light text-foam text-opacity-50"
                    >
                      Balance: {{ ethBalance }}
                    </label>
                  </div>
                  <div class="mt-2 h-12 rounded-md shadow-sm flex">
                    <div
                      class="
                        flex flex-row
                        items-center
                        justify-between
                        bg-level-2-light
                        rounded-l-lg
                        pl-3
                        pr-2
                        w-60
                      "
                    >
                      <div class="text-foam font-bold text-opacity-80">ETH</div>
                      <!-- <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-action-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div> -->
                    </div>
                    <input
                      type="text"
                      name="order-from"
                      id="order-from"
                      class="
                        text-right text-lg
                        font-bold
                        border-level-2-light
                        bg-level-2-dark
                        focus:ring-action-blue focus:border-action-blue
                        flex-grow
                        block
                        w-full
                        min-w-0
                        rounded-none rounded-r-md
                        border-gray-300
                      "
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div>
                  <div class="flex flex-row justify-between items-center">
                    <label
                      for="company-website"
                      class="
                        block
                        text-sm
                        font-medium
                        text-foam text-opacity-50
                      "
                    >
                      To
                    </label>
                    <label
                      for="company-website"
                      class="block text-sm font-light text-foam text-opacity-50"
                    >
                      Balance: 0.00
                    </label>
                  </div>
                  <div class="mt-2 h-12 rounded-md shadow-sm flex">
                    <div
                      class="
                        flex flex-row
                        items-center
                        justify-between
                        bg-level-2-light
                        rounded-l-lg
                        pl-3
                        pr-2
                        w-60
                        hover:bg-opacity-75
                        cursor-pointer
                      "
                      @click="pickActiveToken"
                    >
                      <div
                        class="
                          text-foam
                          font-bold
                          text-opacity-80
                          overflow-ellipsis overflow-hidden
                        "
                      >
                        {{
                          activeToken != null
                            ? activeToken.code.substring(0, 7) + ".."
                            : "Select token"
                        }}
                      </div>
                    </div>
                    <input
                      type="text"
                      name="order-from"
                      id="order-from"
                      class="
                        text-right text-lg
                        font-bold
                        border-level-2-light
                        bg-level-2-dark
                        focus:ring-action-blue focus:border-action-blue
                        flex-grow
                        block
                        w-full
                        min-w-0
                        rounded-none rounded-r-md
                        border-gray-300
                      "
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end">
                <div class="flex flex-row items-center justify-between">
                  <label
                    for="company-website"
                    class="block text-sm font-light text-foam text-opacity-50"
                  >
                    Price
                  </label>
                  <label
                    for="company-website"
                    class="block text-sm font-medium text-foam text-opacity-80"
                  >
                    NaN
                  </label>
                </div>
                <div class="flex flex-row items-center justify-between">
                  <label
                    for="company-website"
                    class="block text-sm font-light text-foam text-opacity-50"
                  >
                    Max Slippage
                  </label>
                  <label
                    for="company-website"
                    class="block text-sm font-medium text-foam text-opacity-80"
                  >
                    3%
                  </label>
                </div>
                <div class="mt-2">
                  <Button label="Swap" extraClasses="w-full" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <TokenPicker ref="tokenPicker" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Button from "../views/common/Button.vue";
import TokenPicker from "../views/tokens/TokenPicker.vue";

export default {
  name: "Swap",
  components: {
    Button,
    TokenPicker,
  },
  props: {
    assetToken: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      util: {
        numberFormat: new Intl.NumberFormat("en-US", {
          maximumSignificantDigits: 3,
        }),
      },
      activeAssetToken: this.assetToken ?? null,
    };
  },
  computed: {
    ...mapGetters({
      ethBalance: "userEthBalance",
    }),
  },
  methods: {
    ...mapActions({
      sync: "syncWallet",
    }),

    pickActiveToken() {
      this.$refs.tokenPicker.open = true;
    },
  },
  created() {
    this.sync({ $toast: this.$toast });
  },
};
</script>