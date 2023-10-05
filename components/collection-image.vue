<script>
// import {mapState} from 'vuex'
export default {
  name: 'collection-image',
  props: {
    collection: {
      type: Object,
      required: false,
    },
    imageOverride: {
      type: String,
    },
    styleOverride: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    imageDisplayed() {
      const imageMap = {
        coin: {
          alt: 'mario coin',
          src: '',
          value: 'coin',
        },
        pokedex: {
          alt: '',
          src: '/pokedex.png',
          value: 'pokedex',
        },
        wallet: {
          alt: '',
          src: '/money-bag.png',
          value: 'wallet',
        },
      }
      if (imageMap[this.imageOverride]) {
        return imageMap[this.imageOverride]
      }

      if (this.subview === 'collection' && this.isConnectedWallet) {
        return imageMap.coin
      }
      if (!this.collection?.id || !this.collection.isWallet) {
        return imageMap.pokedex
      }
      return imageMap.wallet
    },
    isConnectedWallet() {
      return (
        this?.$store?.state?.connectedWallet ===
        this.collection?.wallet?.address
      )
    },
  },
}
</script>
<template>
  <tooltip-wrapper
    :text="
      isConnectedWallet
        ? 'Connected Wallet'
        : `Collection type: ${collection.isWallet ? 'wallet' : 'custom'}`
    "
  >
    <i
      v-if="imageDisplayed.value === 'coin'"
      class="nes-icon coin is-large"
      :style="styleOverride"
    ></i>
    <img
      v-else
      :src="imageDisplayed.src"
      :alt="imageDisplayed.alt"
      :style="styleOverride"
    />
  </tooltip-wrapper>
</template>

<style scoped>
.image-container img {
  height: auto;
  width: 100%;
}
</style>
