<script>
import CollectionImage from '@/components/collection-image.vue'
import DetailCard from '@/components/detail-card.vue'
import collectionMixin from '@/mixins/collection-mixin.vue'
import TooltipWrapper from './tooltip-wrapper.vue'
export default {
  name: 'collection-item',
  props: {
    collection: {
      type: Object,
      required: true,
    },
  },
  mixins: [collectionMixin],
  components: {
    CollectionImage,
    DetailCard,
    TooltipWrapper,
  },
  data: () => ({
    showExtended: false,
  }),
  // computed: {
  //   collection.isWallet() {
  //     return !this.collection?.isCustom && this.collection.value !== 'nfty'
  //     // || this.collection?.wallet?.address
  //   },
  // },

  methods: {
    onEdit() {
      this.collectionEdit(this.collection)
    },
    onExtend() {
      this.showExtended = !this.showExtended
      if (this.showExtended) {
        const el = this.$refs[`coll${this.collection.id}`]
        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
    },
  },
}
</script>

<template>
  <article
    :ref="`coll${collection.id}`"
    class="card nes-container is-rounded is-dark flex-column full-width"
  >
    <!-- @click="$emit('openCollection', collection)" -->
    <section class="content-section flex-row flex-grow full-width">
      <div class="image-container">
        <collection-image :collection="collection" />
      </div>
      <div class="description-section full-width">
        <div
          class="info-line title nes-text"
          :class="collection?.name ? 'is-primary' : 'is-warning'"
        >
          <h4 class="m0">
            {{ collection?.name }}
            <tooltip-wrapper
              :text="`Items in collection: ${collection.itemCount || 0}`"
            >
              <h6 class="nes-text is-disabled">
                ({{ collection.itemCount || 0 }})
              </h6>
            </tooltip-wrapper>
          </h4>
        </div>
        <div class="info-line description">
          <p v-html="collection?.note"></p>
        </div>
        <!-- <div class="info-line description mb-s"> -->
        <!-- <h6 v-html="collection?.wallet?.address"></h6> -->
        <!-- </div> -->

        <!-- <clipboard-container :content="collection.nftId" :text="ID">
        {{ collection.nftId }}
      </clipboard-container> -->
      </div>
      <div class="button-section flex-column align-end justify-between">
        <tooltip-wrapper text="Show NFT list">
          <nuxt-link
            :to="`/collections/collection/${collection.id}`"
            class="nft-list-btn pointer"
          >
            <button role="button" class="nes-btn is-primary">
              <img src="/show-list-white.png" alt="" />
            </button>
          </nuxt-link>
        </tooltip-wrapper>
        <tooltip-wrapper
          text="Show more details"
          subtext="and actions"
          class="extend-button mt-auto"
        >
          <extend-button
            :isExtended="showExtended"
            @click="onExtend"
          ></extend-button>
        </tooltip-wrapper>
      </div>
    </section>
    <section
      class="expansion-section full-width pt-s"
      :class="{ show: showExtended }"
    >
      <detail-card
        v-if="collection.isWallet"
        :detail="{ detail: 'Address', value: collection.wallet.address }"
        :link="
          collection.isWallet
            ? {
                href: `https://etherscan.io/address/${collection.wallet.address}`,
                title: 'View on etherscan',
              }
            : undefined
        "
        class="mr-auto my"
      ></detail-card>

      <section class="action-section flex-row full-width mt-s">
        <div class="meta-info flex-column">
          <p>created: {{ collection.created_at_human || '-' }}</p>
          <p>updated: {{ collection.updated_at_human || '-' }}</p>
        </div>
        <div class="action-btns ml-auto">
          <tooltip-wrapper text="Edit collection details">
            <button @click="onEdit" class="action-btn nes-btn is-warning">
              <img src="/edit.png" alt="edit" />
            </button>
          </tooltip-wrapper>
          <tooltip-wrapper
            text="Add an nft to collection"
            :subtext="
              collection.isWallet ? '(cannot add to type: wallet)' : undefined
            "
          >
            <button
              @click="$emit('addNftToCollection', { collection, nft: {} })"
              class="action-btn nes-btn is-success"
              :class="{ 'is-disabled': collection.isWallet }"
            >
              &#43;
            </button>
          </tooltip-wrapper>
        </div>
      </section>
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
  padding: 1rem;
  position: relative;
  max-width: 900px;
  min-width: 400px;
  width: 100%;
}

.nft-list-btn button {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  cursor: var(--cursor-pointer);
  height: 30px;
  width: 30px;
  padding: 0px;
  text-align: center;
}

.nft-list-btn button img {
  height: 15px;
  width: 15px;
}

.content-section {
  align-items: stretch;
  justify-content: start;
  position: relative;
  min-height: 100px;

  /* padding-bottom: var(--spacing-base); */
  /* padding-block: 1rem; */
  /* height: 10rem; */
}

.content-section p {
  font-size: 0.75rem;
  line-height: 2;
}

.image-container {
  /* height: 4rem; */
  width: clamp(4rem, 20vw, 6rem);
  min-width: 4rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.description-section {
  padding-inline: 1rem;
}

.info-line {
  display: flex;
  align-content: flex-end;
  width: 100%;
}

.description {
  /* margin-top: 1rem; */
  max-height: 6rem;
  overflow-y: auto;
}

.button-section {
  margin-top: -8px;
  margin-right: -8px;
  margin-bottom: -8px;
}

.expansion-section {
  max-height: 0px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.5s ease-out;
}

.expansion-section.show {
  max-height: 500px;
  visibility: visible;
  opacity: 1;
  transition: all 0.5s ease-in;
}

.meta-info {
  align-items: flex-start;
  justify-content: space-between;
  white-space: nowrap;
  font-size: 0.75rem;
}
</style>
