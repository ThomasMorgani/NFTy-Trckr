<script>
// import ClipboardContainer from '@/components/clipboard-container.vue'
import ImageMissing from '@/components/image-missing.vue'
export default {
  name: 'nft-card-nfty',
  props: {
    nft: {
      type: Object,
      required: true,
    },
  },
  components: {
    // ClipboardContainer,
    ImageMissing,
  },
}
</script>

<template>
  <article
    class="card nes-container is-rounded is-dark nft flex-row full-width"
  >
    <img
      class="info-icon nes-avatar is-medium pointer"
      alt="Gravatar image example"
      src="/info-box.png"
      @click="$emit('showDetails', nft)"
    />
    <div class="image-container">
      <img v-if="nft.image" :src="nft.image" alt="" />
      <image-missing v-else></image-missing>
    </div>
    <section class="content-section flex-column px">
      <div
        class="info-line title nes-text"
        :class="nft.title ? 'is-primary' : 'is-warning'"
      >
        <h4 class="m0">
          {{ nft.title || 'UNKNOWN NFT' }}
          <h6 class="nes-text is-disabled">({{ nft.total || '-' }})</h6>
        </h4>
      </div>
      <div class="info-line description">
        <h6 v-html="nft.excerpt || `-`"></h6>
      </div>

      <!-- <clipboard-container :content="nft.nftId" :text="ID">
        {{ nft.nftId }}
      </clipboard-container> -->
    </section>
  </article>
</template>
<style lang="css" scoped>
h4,
h6 {
  display: inline-block;
  margin: 0;
}
.card {
  position: relative;
}

.info-icon {
  position: absolute;
  right: 1rem;
  top: 1rem;
  height: 2rem;
  width: 2rem;
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
}

.content-section {
  align-items: flex-start;
  justify-content: start;
  padding-block: 1rem;
  height: 10rem;
}

.info-line {
  display: flex;
  align-content: flex-end;
  width: 100%;
}
.description {
  margin-top: 1rem;
  max-height: 6rem;
  overflow-y: auto;
}
</style>
