<script>
import CollectionMixin from '@/mixins/collection-mixin.vue'
import utils from '~/services/utils'
export default {
  name: 'list-stats',
  mixins: [CollectionMixin],
  computed: {
    cachedText() {
      if (this.view === 'collections') {
        if (this.subView === 'all') {
          return '-'
        }
        if (this.subView === 'collection') {
          // if (this?.$route?.params?.id) {
          return this.collectionSelectedData?.id
            ? utils.epochToHuman(this.collectionSelectedData?.updated_at) || '-'
            : '-'

          // }
        }
        return '-'
      }
      //  collectionSelectedData?.cached_utc
      // ? cacheTime(collectionSelectedData.cached_utc)
      // : '-'
      return '-'
    },
    itemsText() {
      if (this.view === 'collections') {
        if (this.subView === 'all') {
          return `${this.collectionsDisplayed?.length || 0} / ${
            this.collections?.length || 0
          }`
        }
        if (this.subView === 'collection') {
          return `${this.nftItemsDisplayed?.length || 0} / ${
            this.collectionSelectedItems?.length || 0
          }`
        }
      }

      return `0 / 0`
    },
    subView() {
      return this.$store.state.subView || ''
    },
    view() {
      return this.$store.state.view || ''
    },
  },
}
</script>

<template>
  <div class="stats">
    <h5 class="displayed-count-text">
      displayed items:
      {{ itemsText }}
    </h5>
    <h6 class="displayed-count-text nes-text is-disabled">
      cached:
      {{ cachedText }}
    </h6>
  </div>
</template>
<style lang="css" scoped>
.stats {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  white-space: nowrap;
}
</style>
