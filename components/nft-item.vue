<script>
import api from '@/services/api'
import wallet from '@/services/wallet'

import nftMixin from '@/mixins/nft-mixin.vue'

import ClipboardContainer from '@/components/clipboard-container.vue'
import ImageMissing from '@/components/image-missing.vue'
import NftPreview from '@/components/nft-preview.vue'
export default {
  name: 'nft-item',
  props: {
    nft: {
      type: Object,
      required: true,
    },
    walletData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ClipboardContainer,
    ImageMissing,
    NftPreview,
  },
  mixins: [nftMixin],
}
</script>

<template>
  <article
    class="card nes-container is-rounded is-dark nft flex-column full-width"
  >
    <img
      class="info-icon nes-avatar is-medium pointer"
      alt="button to display nft details modal"
      src="/info-box.png"
      @click="$emit('showDetails', nft)"
    />
    <section class="content-section full-width">
      <nft-preview :nft="nft"></nft-preview>
    </section>

    <section class="action-section flex-row full-width">
      <div class="meta-info flex-column">
        <p>token: &nbsp;{{ nft.nftType }}</p>
        <p>minted: {{ nft.createdAtHuman }}</p>
        <!-- <detail-card
          :detail="{ detail: 'Address', value: nft.tokenAddress }"
          :link="{
            href: `https://etherscan.io/address/${nft.tokenAddress}`,
            title: 'View on etherscan',
          }"
          class="mr-auto my"
        ></detail-card> -->
      </div>
      <div>
        <tooltip-wrapper
          text="Remove nft from collection"
          :subtext="
            walletData?.isWallet ? `(Can't remove from type: wallet)` : ''
          "
        >
          <button
            @click="
              walletData?.isWallet
                ? null
                : $emit('removeNftFromCollection', nft)
            "
            class="action-btn nes-btn is-error"
            :class="walletData?.isWallet ? 'is-disabled' : ''"
          >
            &#45;
          </button>
        </tooltip-wrapper>
        <tooltip-wrapper text="Add nft to another collection">
          <button
            @click="$emit('addNftToCollection', { nft })"
            class="action-btn nes-btn is-success"
          >
            &#43;
          </button>
        </tooltip-wrapper>
      </div>
    </section>
  </article>
</template>
<style lang="css" scoped>
.card {
  position: relative;
  max-width: 100%;
}

.info-icon {
  position: absolute;
  right: 1rem;
  top: 1rem;
  height: 2rem;
  width: 2rem;
}

.content-section {
  padding-right: 1.25rem;
  /* align-items: flex-start;
  justify-content: start; */
  /* padding-block: 1rem; */
}

.action-section {
  display: flex;
  align-content: flex-end;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
}
.meta-info {
  align-items: flex-start;
  justify-content: space-between;
  white-space: nowrap;
  font-size: 0.75rem;
}
</style>
