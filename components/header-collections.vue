<script>
import { mapGetters, mapState } from 'vuex'
import CollectionImage from '@/components/collection-image.vue'
import Filters from '@/components/filters.vue'
import ListStats from '@/components/list-stats.vue'

import collectionMixin from '@/mixins/collection-mixin.vue'
import nftMixin from '@/mixins/nft-mixin.vue'

import db from '@/services/db.js'
import loopring from '@/services/loopring'
import utils from '@/services/utils.js'

export default {
  name: 'header-collections',
  components: {
    CollectionImage,
    Filters,
    ListStats,
  },
  mixins: [collectionMixin, nftMixin],
  data: () => ({
    showExtended: true,
    showFilters: false,
  }),
  computed: {
    ...mapState({
      collections: (state) => state.collections,
      defaultCollections: (state) => state.defaultCollections,
      collectionSelectedData: (state) => state.collectionSelectedData,
      collectionsHeader: (state) => state.collectionsHeader,
      connectedAccount: (state) => state.connectedAccount,
      connectedWallet: (state) => state.connectedWallet,
      contentLoading: (state) => state.contentLoading,
      filters: (state) => state.collectionsHeader.filters,
      subView: (state) => state.subView,
      view: (state) => state.view,
    }),
    // collectionSelect: {
    //   get() {
    //     return this.collectionsHeader.collectionSelect
    //   },
    //   set(v) {
    //     this.updateCollectionsHeader({ collectionSelect: v })
    //   },
    // },

    radioNav: {
      get() {
        return this.$store.state.subView
      },
      set(v) {
        this.$router.push({ path: `/collections/${v}` })
      },
    },
  },
  methods: {
    async apikeyTest() {
      await loopring.getApiKey(this.connectedWallet, this.connectedAccount)
    },
    cacheTime(time_utc) {
      return utils.epochToHuman(time_utc)
    },
    collectionImageStyle() {
      const baseStyle = {
        width: '2.75rem',
        height: '2.75rem',
        transform: 'scale(2)',
        margin: '0 10px 0 0',
      }
      const isConnectedWallet =
        this?.connectedWallet === this.collectionSelectedData?.wallet?.address
      return this.showFilters === 'collection' && isConnectedWallet
        ? {
            // ...baseStyle,
            margin: '0px 25px 12px 0px',
            transform: 'scale(2)',
          }
        : {
            ...baseStyle,
            transform: 'scale(1)',
          }
    },
    messageText() {
      if (!this.subView) return 'Select a view.'
      if (this.subView === 'all') return 'Collection Library'
      if (this.view === 'collection' && !this.collectionSelectedData?.id)
        return 'No collection selected.'
      if (this.collectionSelectedData?.name)
        return this.collectionSelectedData.name
      return ''
    },
    onAddButton() {
      // loopring.test()
      if (this.view === 'collections') {
        if (this.subView === 'collection') {
          this.$store.dispatch('setModalData', {})
          this.$store.dispatch('toggleModal', 'nft-add')
          return
        }
        this.$store.dispatch('toggleModal', 'collection-edit')
        return
      }
    },
    onCollectionRadio() {
      if (this.subView === 'all') {
        this.$store.dispatch('setSubView', null)
        this.$router.push({ name: 'collections' })
      }
    },
    onFilterButton() {
      this.showFilters = !this.showFilters
      if (this.showFilters) this.showExtended = true
    },
    async onNftRadio(e) {
      if (this.subView === 'collection') {
        //if already in collection view and has a collection loaded
        //clear selected collection and display cached NFTs
        const cachedNfts = await db.getAll('nfts')
        const updated_at =
          cachedNfts.sort((a, b) => b.updated_at - a.updated_at)?.[0]
            ?.updated_at || null
        const cachedNftIds = cachedNfts.map((nft) => nft.id)
        const collectionData = {
          ...this.defaultCollection,
          id: 'cached',
          name: 'All NFTs',
          updated_at,
        }
        this.$store.dispatch('setCollectionSelectedData', collectionData)
        this.$store.dispatch('setCollectionSelectedItems', cachedNftIds)
        this.$store.dispatch('setCollectionItemsData', cachedNfts)
      }
    },
    async refreshCollectionSelectedData() {
      if (this.contentLoading) return
      const selectedCollection = this.collectionSelectedData
      if (!selectedCollection?.id && !selectedCollection?.isWallet) {
        console.log('ONLY REFRESH WALLET COLLECTIONS NOW')
        return
      }
      this.$store.dispatch('setContentLoading', true)
      this.$store.dispatch('setCollectionSelectedItems', [])
      try {
        const res = await this.syncCollectionWalletItems(selectedCollection)
        // this.$store.dispatch()
      } catch (e) {
        console.log(e.message)
        //Temp error feedback error fix
        const text = e.message.includes('API KEY REQUIRED')
          ? 'Wallet not connected!'
          : e.message || ''
        this.$store.dispatch('setSnackbar', { show: true, text })
      }
      this.$store.dispatch('setContentLoading', false)
    },
    sortOptionText(option) {
      return option.split('_').join(' ')
    },
    toggleFilters() {
      this.updateCollectionsHeader({ filters: { show: !this.filters.show } })
    },
  },
}
</script>
<template>
  <article class="main-section flex-column full-width">
    <!-- TOGGLE EXPAND VIEW BTN -->

    <extend-button
      :isExtended="showExtended"
      @click="showExtended = !showExtended"
      class="extend-button"
    ></extend-button>
    <div
      class="top-section flex-column space-between full-width"
      :class="{ show: showExtended }"
    >
      <filters v-if="showFilters"></filters>
      <div
        v-else
        class="view-container nes-container with-title is-rounded d-flex"
      >
        <p class="title">View</p>

        <label
          class="nes-text mr"
          :class="`is-${radioNav === 'all' ? 'primary' : ''}`"
        >
          <input
            v-model="radioNav"
            name="radio-collection"
            type="radio"
            value="all"
            class="nes-radio"
            @click="onCollectionRadio"
          />
          <span>Collections</span>
        </label>
        <label
          class="nes-text"
          :class="`is-${radioNav === 'collection' ? 'primary' : ''}`"
        >
          <input
            v-model="radioNav"
            value="collection"
            type="radio"
            class="nes-radio"
            name="radio-collection"
            @click="onNftRadio"
          />
          <span>NFTs</span>
        </label>
      </div>
    </div>
    <div class="flex-row">
      <collection-image
        :collection="collectionSelectedData"
        :styleOverride="collectionImageStyle()"
      />
      <h3 class="title-text nes-text is-primary flex-row">
        <div v-if="!subView">
          Select a
          <span
            @click="showExtended = true"
            :class="{ 'view-text': !showExtended }"
          >
            view</span
          >.
        </div>
        <div v-else>{{ messageText() }}</div>
      </h3>
    </div>
    <div class="bottom-section flex-row full-width">
      <ListStats />

      <!-- <label
          class="nes-text ml-auto"
          :class="`is-${
            hasFilters ? 'success' : radioNav === 'filters' ? 'primary' : ''
          }`"
        >
          <input
            v-model="showFilters"
            name="enable-filters"
            type="checkbox"
            class="nes-checkbox is-dark"
            :class="`is-${
              hasFilters ? 'success' : radioNav === 'filters' ? 'primary' : ''
            }`"
          />
          <span>Filters</span>
        </label> -->

      <header-buttons
        :showFilters="showFilters"
        @addBtn="onAddButton"
        @filterBtn="onFilterButton"
        @refreshBtn="refreshCollectionSelectedData"
      />
    </div>

    <!-- <div
        v-if="view === 'collection'"
        class="collection-select flex-row full-width"
      >
        <div class="full-width">
          <div class="nes-select">
          <CollectionSelect/>
          </div>
        </div>
      </div> -->
  </article>
</template>
<style lang="css" scoped>
.extend-button {
  position: absolute;
  top: 8px;
  right: 8px;
}

.main-section {
  padding: 0px;

  align-items: flex-start;
  justify-content: space-between;
}

.top-section {
  align-items: flex-start;
  justify-items: flex-start;
  height: 0px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s linear;
  /* overflow: hidden; */
}

.top-section.show {
  height: 120px;
  opacity: 1;
  visibility: visible;
  transition: all 0.5s linear;
}

/* changes to column in filter component */
@media screen and (max-width: 620px) {
  .top-section.show:has(.filters-section) {
    height: 240px;
  }
}

.title-text {
  /* margin-bottom: 0.5rem; */
}

.title-text .view-text {
  text-decoration: underline;
  cursor: var(--cursor-pointer);
}

.view-container {
  /* max-width: 85%; */
}

.view-container.nes-container.is-rounded.with-title {
  padding: 1rem;
}

.view-container.nes-container.is-rounded.with-title > .title {
  margin-top: -2.5rem;
  margin-bottom: 0;
  background-color: var(--background-color);
  color: #000;
}

.view-container.nes-container.is-rounded.with-title > label {
  margin-block: auto;
  vertical-align: middle;
}

.filter-radio {
  margin-left: 1rem;
}

.nes-radio:checked + span::before {
  color: var(--primary-color);
}

.bottom-btns {
  align-items: flex-end;
  margin-left: auto;
}

.collection-select {
  align-items: center;
  /* display: flex; */
  margin-top: 2rem;
}

.add-collection-btn {
  /* padding: 0.5rem; */
  margin-left: 1.5rem;
}

.bottom-section {
  /* padding-top: 1rem; */
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  width: 100%;
}

.filters-btn {
  display: flex;
  align-items: flex-start;
  padding-inline: 0.5rem;
}

.filters-btn-icon {
  text-shadow: 1px 1px #212529;
}
</style>
