<script>
import BaseView from '@/components/base-view.vue'

export default {
  components: { BaseView },
}
</script>

<template>
  <base-view>
    <template v-slot:title>NFTs</template>
    <template v-slot:image>
      <img src="/question-mark-block.png" alt="mario question mark block"
    /></template>
    <template v-slot:info-box>
      <p class="text-left">A collection's NFTs would be listed here.</p>
      <!-- <p>
        NFTs can be added to a non-wallet collection from the green
        <strong>+</strong> button above.
      </p> -->
      <p class="text-left mt">
        If a collection is not selected then all NFTs cached by
        <span class="nfty-text">NFTy-Trckr</span> will be shown.
      </p>
      <p class="text-left mt">
        Select "NFT" view again to clear current selection.
      </p>
    </template></base-view
  >
</template>

<style lang="css" scoped>
img {
  width: 120px;
}
</style>
