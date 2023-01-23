<template>
  <div>
    <div class="is-flex is-flex-direction-column px-2">
      <div class="is-size-3 has-text-weight-bold mb-3">Claim Airdrop?</div>
      <div class="container has-text-white">
        By clicking claim, you will receive your share of the WEAV airdrop.
        This is a one time action and cannot be undone.
        You are responsible for any tax or other legal obligations that may arise from this action.
        As a member of the Weavr DAO, you are responsible for ensuring that you are eligible to receive the airdrop, and
        that you are not in a jurisdiction that prohibits you from receiving it.
        Please ensure that the claim amount to the right is correct. It should be 0.1% of the total supply of WEAV that
        you will recieve at public TGE.
      </div>
      <div class="is-flex is-flex-direction-row-reverse mt-6">
        <button @click="claim"
                class="button has-background-mint has-text-white has-text-weight-bold m-1">Claim
        </button>
        <button @click="onCancel"
                class="button has-background-red has-text-white has-text-weight-bold m-1">Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-max-width-60ch {
  max-width: 60ch;
}
</style>

<script>
import ServiceProvider from "@/services/provider";
import {ethers} from "ethers";
import {CONTRACTS} from "@/services/constants";

export default {
  name: "AirdropClaimModal",
  methods: {
    async refresh() {
      const airdrop = ServiceProvider.airdrop();
      const token = ServiceProvider.token();
      this.amount = ethers.utils.formatEther((await airdrop.viewClaimedAmount(this.walletAddress)));
      this.airdropBalance = ethers.utils.formatEther((await token.getTokenBalance(CONTRACTS.TOKEN_ADDRESS, this.airdropAddress)));
    },
    async claim() {
      if (parseFloat(this.airdropBalance) === 0) return;
      const airdrop = ServiceProvider.airdrop();
      await airdrop.claim();
      this.$toast.success("Claim successful!");
    },
    onCancel() {
      this.$router.back();
    }
  }
}
</script>