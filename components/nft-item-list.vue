<script>
import NftItem from '~/components/nft-item.vue'
import collectionMixin from '@/mixins/collection-mixin.vue'
import nftMixin from '@/mixins/nft-mixin.vue'
import db from '@/services/db'
import utils from '@/services/utils'
export default {
  name: 'nft-item-list',
  components: {
    NftItem,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [collectionMixin, nftMixin],
  methods: {
    epochToHuman(epoch) {
      return utils.epochToHuman(epoch)
    },
    async onRemoveNft(nft) {
      try {
        await this.removeNftFromCollection(
          this.collectionSelectedData.id,
          nft.id
        )
        this.$store.dispatch('setSnackbar', { show: true, text: 'nft removed' })
      } catch (e) {
        console.log(e)
      }
    },
    showNftDetailModal(nft) {
      this.$store.dispatch('setModalData', nft)
      this.$store.dispatch('toggleModal', 'nft-detailed')
    },
  },
  async mounted() {
    console.log('collection-item-list mounted')
    console.log(this.collectionSelectedItems)
    // console.log(this.collectionItemsData)
    if (this?.collectionSelectedItems?.length) {
      const items = []
      for (let item of this.collectionSelectedItems) {
        const itemData = await db.get('nfts', item)
        if (itemData?.nftId) {
          // itemData.createdHuman = this.epochToHuman(itemData.created_at) || '-'
          // itemData.updatedHuman = this.epochToHuman(itemData.updated_at) || '-'
          items.push(itemData)
        }
      }
      this.$store.dispatch('setCollectionItemsData', items)
    }
  },
}
</script>
<template>
  <div class="collection-list">
    <nft-item
      v-for="nft in nftsDisplayed"
      :key="nft.id"
      :nft="nft"
      :walletData="collectionSelectedData"
      class="collection-item"
      @addNftToCollection="addNftToCollection"
      @removeNftFromCollection="onRemoveNft"
      @showDetails="showNftDetailModal"
    ></nft-item>
  </div>
</template>

<style lang="css" scoped>
.collection-list .collection-item:not(:first-child) {
  margin-top: var(--spacing-s);
}
</style>
