<script>
import DetailCard from '@/components/detail-card.vue'
import Loader from '@/components/loader.vue'
import Modal from '@/components/modal.vue'
import ModelViewer from '@/components/model-viewer-wrapper.vue'

import nftMixin from '@/mixins/nft-mixin.vue'

export default {
  name: 'nft-detailed',
  components: {
    DetailCard,
    Loader,
    Modal,
    ModelViewer,
  },
  mixins: [nftMixin],
  data: () => ({
    details: [
      {
        name: 'created_at_human',
        label: 'Created',
      },
      {
        name: 'creatorFeeBips',
        label: 'Creator Fee Bips',
      },
      //       {
      //   name: 'nftBaseUri',
      //   label: 'Base Uri',
      // },
      {
        name: 'minter',
        label: 'Minter',
      },
      {
        name: 'nftData',
        label: 'NFT Data',
      },
      {
        name: 'nftFactory',
        label: 'NFT Factory',
      },
      {
        name: 'nftId',
        label: 'NFT ID',
      },
      {
        name: 'originalMinter',
        label: 'Original Minter',
      },
      {
        name: 'nftOwner',
        label: 'Owner',
      },

      {
        name: 'royaltyAddress',
        label: 'Royalty Address',
      },
      {
        name: 'royaltyPercentage',
        label: 'Royalty %',
      },
      {
        name: 'status',
        label: 'Status',
      },
      {
        name: 'tokenAddress',
        label: 'Token Address',
      },
      {
        name: 'nftType',
        label: 'Type',
      },
    ],
    detailView: 'info',
    holdersState: 'image',
    mediaType: false,
    nftHolders: null,
    nftHoldersCount: null,
  }),
  computed: {
    detailSectionHeight() {
      return '200px'
    },
    displayedImage() {
      return this.nft?.metadata?.animation || this.nft?.metadata?.image || ''
    },
    displayedAttributes() {
      if (this.nft?.metadata?.attributes?.length > 0) {
        return this.nft.metadata.attributes.map((attr) => ({
          detail: attr.trait_type || '',
          value: attr.value || '',
        }))
      }
      if (this.nft?.metadata?.properties) {
        return Object.entries(this.nft.metadata.properties).map(
          ([detail, value]) => ({
            detail,
            value,
          })
        )
      }
      return []
    },
    nft() {
      return this.$store.state.modalData || {}
    },
  },
  methods: {
    async getHolders() {
      if (this.detailView !== 'holders') {
        return
      }
      if (!this.connectedWallet) {
        this.holdersState = 'Connect wallet to query NFT holders.'
        return
      }

      if (this.nftHolders !== null) {
        console.log('todo: setup lazy auto load more')
        return
      }

      const { nftHolders, totalNum } = await this.getNftHolders(
        this.nft.nftData,
        true
      )
      if (nftHolders && totalNum) {
        this.nftHolders = nftHolders
        this.nftHoldersCount = totalNum
        this.holdersState = `Showing ${nftHolders.length} of ${this.nftHoldersCount}`
        return
      }
      this.holdersState = null
      //todo setup pagination, lazy loading
    },
    setDetailHeight() {
      const modalHeight = this.$refs?.modal?.$el?.firstChild?.offsetHeight || 0
      //margin/paddding, title, radio row, image container,
      const contentOffset =
        80 + 50 + 50 + this.$refs?.imageContainer?.offsetHeight || 0
      const height = modalHeight - contentOffset
      this.$refs.detailSection.style.height = height + 'px'
      return height
    },
    async setIframeDimensions(e) {
      console.log(e)
      if (this.mediaType) return
      if (e === 'image error') {
        this.mediaType = 'iframe'
      } else {
        this.mediaType = 'image'
      }
      // console.log(this.displayedImage)
      this.imgLoaded = true
      return

      //TODO:
      //
      //  REFACTOR ALL THIS
      //  IF ANIMATION FAILS TO LOAD IN IMG TAG
      //  IF THIS GETS HIT, THEN SHOW IMG
      //  ELSE SHOW IFRAME
      // PASS ERROR, IF ERROR, TRY NEXT
      // DOES CANVAS FIX THIS?

      if (!this.displayedImage) return
      console.log(this.displayedImage)
      const img = new Image()

      const imageContainer = this.$refs.imageContainer
      const maxHeight = 400
      const maxWidth = 400
      console.dir(imageContainer)
      const test = this.$refs.imageContainer
      const iframe = this.$refs.iframe
      console.dir(test)
      console.dir(iframe)
      img.onload = (e) => {
        console.dir(e)
        if (
          e?.target &&
          e.target.height < maxHeight &&
          e.target.width < maxWidth
        ) {
          imageContainer.style.height = e.target.height + 'px'
          imageContainer.style.width = e.target.width + 'px'
        }
        this.$nextTick(this.setDetailHeight)
      }
      img.src = this.displayedImage
    },
    trimDetail(detail = '') {
      const detailLength = detail.length || 0
      if (detailLength > 10) {
        return `${detail.substring(0, 6)}...${detail.substring(
          detailLength - 6
        )}`
      }
      return detail
    },
  },
  async mounted() {
    console.log('modal mounted')
    // this.setIframeDimensions()
  },
}
</script>
<template>
  <modal ref="modal" :isOpen="$store.state.modal === 'nft-detailed'">
    <div class="card" @click.stop="">
      <h2 class="title nes-text is-primary">
        {{ nft.metadata?.name || 'NFT DETAILS' }}
      </h2>

      <!-- <section ref="imageContainer" class="image-container"> -->
      <!-- src="https://loopring.mypinata.cloud/ipfs/QmQ9htoCZ7Vr6JArpq6HtnvszghmyKEx16AYgq5PqGXj7y/?filename=src" -->

      <!-- detect image size and adjust -->
      <!-- https://www.dyn-web.com/tutorials/iframes/height/ -->

      <!-- <p v-if="displayedImage" class="image-loading">loading...</p> -->
      <!-- class="image-iframe" -->
      <div class="media-container">
        <!-- <model-viewer :nftMetaData="nft.metadata"></model-viewer> -->
        <img
          v-if="mediaType !== 'iframe'"
          :src="displayedImage"
          @error="setIframeDimensions('image error')"
          @load.once="setIframeDimensions('image')"
        />
        <iframe
          v-else
          :src="displayedImage"
          ref="iframe"
          class="image-iframe"
          allow="accelerometer; autoplay; encrypted-media; fullscreen; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-storage-access-by-user-activation"
          frameborder="0"
          @load.once="setIframeDimensions('iframe')"
        ></iframe>
      </div>
      <!-- <img :src="" alt="preview image of nft" /> -->
      <!-- </section> -->
      <div class="radio-row flex-row full-width">
        <label
          class="nes-text mr"
          :class="`is-${detailView === 'info' ? 'primary' : ''}`"
        >
          <input
            v-model="detailView"
            value="info"
            type="radio"
            class="nes-radio is-dark"
            name="answer-dark"
          />
          <span>Info</span>
        </label>

        <label
          class="nes-text mx-auto"
          :class="`is-${detailView === 'details' ? 'primary' : ''}`"
        >
          <input
            v-model="detailView"
            value="details"
            type="radio"
            class="nes-radio is-dark filter-radio"
            name="answer-dark"
          />
          <span>Details</span>
        </label>
        <label
          class="nes-text mr"
          :class="`is-${detailView === 'holders' ? 'primary' : ''}`"
        >
          <input
            v-model="detailView"
            value="holders"
            type="radio"
            class="nes-radio is-dark filter-radio"
            name="answer-dark"
            @change="getHolders"
          />
          <span>Hodlers</span>
        </label>
      </div>
      <article
        ref="detailSection"
        class="details-section flex-column full-width"
      >
        <!-- :style="{ height: detailSectionHeight }" -->
        <template v-if="detailView === 'info'">
          <p class="info-text pb">{{ nft?.metadata?.description || '' }}</p>
          <detail-card
            v-for="attribute in displayedAttributes"
            :key="attribute.detail"
            :detail="attribute"
            :showActions="false"
          ></detail-card>
        </template>
        <template v-if="detailView === 'details'">
          <DetailCard
            v-for="detail in details"
            :key="detail.name"
            :detail="{ detail: detail.label, value: nft[detail.name] || '-' }"
            class="detail"
          ></DetailCard>
        </template>
        <template v-if="detailView === 'holders'">
          <loader
            v-if="holdersState === 'loading'"
            class="loader mx-auto"
          ></loader>
          <div v-else class="holders-text nes-text is-warning">
            {{ holdersState }}
          </div>
          <DetailCard
            v-for="detail in nftHolders"
            :key="detail.accountId"
            clipboardKey="detail"
            :detail="{ detail: detail.owner, value: `Count: ${detail.amount}` }"
          ></DetailCard>
          <!-- pickup here, display holders count (keep track of count pagination, > count > 500 ? "count+" : "count"), list -->
        </template>
      </article>
    </div>
  </modal>
</template>

<style lang="css" scoped>
.nes-radio.is-dark + span {
  /* color: #fff; */
  color: unset;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 90vh;
  width: 80vw;
}
/* .image-container {

} */

.image-loading {
  position: absolute;
  z-index: -1;
}

.media-container {
  height: 400px;
  min-height: 200px;
  min-width: 200px;
  width: 400px;
  box-sizing: border-box;
  margin-block: 1rem;
  padding: 0.5rem;
  display: flex;
  justify-items: center;
  border: 0.1rem;
  border-style: solid;
  border-color: #fff;
  resize: both;
  overflow: auto;
}

.media-container iframe,
.media-container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.radio-row {
  padding-block: 1rem;
  width: 100%;
  max-width: 44rem;
}

.details-section {
  position: relative;
  /* flex-wrap: wrap; */
  text-align: left;
  align-content: flex-start;
  font-size: 0.75rem;
  padding-inline: 1rem;
  margin-top: 1rem;
  /* height: calc(100% - 600px); */
  width: 100%;
  max-width: 900px;
  height: calc(90vh - 40%);
  min-height: 20%;
  overflow: auto;
}

.detail {
  margin-inline: auto;
}

.holders-text {
  background: var(--background-color-dark);
  display: block;
  right: 0;
  top: 0;
  position: sticky;
  padding-bottom: 1rem;
  width: 100%;
  z-index: 2;
}

/* .detail-column {
  height: 100%;
}

.detail-row {
  align-content: center;
  justify-content: space-between;
} */
</style>
