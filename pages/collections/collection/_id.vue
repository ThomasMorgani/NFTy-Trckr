<script>
import NftItemList from '~/components/nft-item-list.vue'
import NftWelcome from '~/components/nft-welcome.vue'
import collectionMixin from '@/mixins/collection-mixin.vue'
import db from '@/services/db'
export default {
  name: 'collection-view',
  mixins: [collectionMixin],
  components: { NftItemList, NftWelcome },
  computed: {
    componentMounted() {
      // if (!this?.nftItemsDisplayed?.length) {
      if (!this?.collectionSelectedItems?.length) {
        return 'nft-welcome'
      }

      return 'nft-item-list'
    },
    componentMountedData() {},
  },
  async created() {
    const { collectionSelectedData, collectionSelectedItems } =
      this.$store.state

    this.$store.dispatch('setContentLoading', true)
    if (this?.$route?.params?.id) {
      db.setLocalStorage('last-collection', this.$route.params.id)
      if (this.$route.params.id !== collectionSelectedData?.id) {
        console.log('not equal')
        const hi = await this.setCollectionSelected(this.$route.params.id)
        console.log(hi)
      }
    }
    this.$store.dispatch('setContentLoading', false)
    console.log('no params id')

    if (collectionSelectedData?.id) {
      this.$store.dispatch('setContentLoading', false)
      return
    }
    //TODO: get last view localStorage
    // return
    const lastViewedCollection = collectionSelectedData?.id
      ? collectionSelectedData.id
      : db.getLocalStorage('last-collection') || 'nfty'
    await this.setCollectionSelected(lastViewedCollection)
    this.$store.dispatch('setContentLoading', false)
  },
}
</script>

<template>
  <!-- <p>test</p> -->
  <!-- v-if="!$store.state.contentLoading" -->
  <component :is="componentMounted"></component>
</template>

<style scoped></style>
