<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="fixed z-100 inset-0 overflow-y-auto" @close="open = false">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
          <div class="inline-block align-bottom bg-level-2-light rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
            <ul class="divide-y divide-foam">
              <li v-for="(token, i) in tokens" :key="token.symbol" class="py-4 flex">
                <div>
                  <p 
                    class="text-lg font-medium text-foam hover:opacity-75 cursor-pointer"
                    @click="pick(i)"
                  >{{ token.symbol }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from "@headlessui/vue"

const tokens = [
  {
    symbol: "FBRA-001"
  },
  {
    symbol: "FBRA-002"
  },
  {
    symbol: "FBRA-003"
  },
]

export default {
  name: "TokenPicker",
  components: {
    Dialog,
    DialogOverlay,
    TransitionChild,
    TransitionRoot,
  },
  data() {
    return {
      open: false,
      tokens: tokens
    }
  },
  methods: {
    pick(index) {
      this.open = false
    }
  }
}
</script>