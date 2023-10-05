<script>
export default {
  name: 'nft-preview',
  props: {
    nft: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div class="card">
    <div
      class="info-line nes-text"
      :class="nft.metadata?.name ? 'is-primary' : 'is-warning'"
    >
      <h4 class="m0 title pr">
        {{ nft.metadata?.name || 'UNKNOWN NFT' }}
        <!-- <h6 class="nes-text is-disabled">({{ nft.total }})</h6> -->
      </h4>
    </div>
    <section class="description-section flex-row">
      <div class="image-container">
        <img v-if="nft.metadata.image" :src="nft.metadata.image" alt="" />
        <image-missing v-else></image-missing>
      </div>
      <div class="description">
        <h6
          v-html="
            nft?.metadata.description || `token address: ${nft.tokenAddress}`
          "
        ></h6>
      </div>

      <!-- <clipboard-container :content="nft.nftId" :text="ID">
        {{ nft.nftId }}
      </clipboard-container> -->
    </section>
  </div>
</template>
<style lang="css" scoped>
h4,
h6 {
  display: inline-block;
  margin: 0;
  margin-bottom: 1rem;
}
.card {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  height: 200px;
}

.description-section {
  align-items: flex-start;
}

.info-line {
  /* white-space: nowrap;
  overflow-x: hidden; */
}

.info-line .title {
  text-overflow: ellipsis;
}

.image-container {
  height: 8rem;
  width: 8rem;
  min-width: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  max-height: 8rem;
  width: auto;
  max-width: 8rem;
  border-radius: var(--border-radius-s);
}

.description {
  padding-left: 1rem;
  max-height: 8rem;
  overflow-y: auto;
}
</style>
