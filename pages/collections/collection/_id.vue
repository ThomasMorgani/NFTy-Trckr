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
    console.log('COLL PAGE')
    const { collectionSelectedData, collectionSelectedItems } =
      this.$store.state

    this.$store.dispatch('setContentLoading', true)
    if (this?.$route?.params?.id) {
      console.log(this.$route.params.id)
      console.log(collectionSelectedData?.id)
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
      //   this.$router.push({
      //     path: `${this.$route.fullPath}/${lastViewedCollection}`,
      //   })
      console.log('selectedData exists')
      console.log('loading false')
      this.$store.dispatch('setContentLoading', false)
      return
    }
    //TODO: get last view localStorage
    // return
    const lastViewedCollection = collectionSelectedData?.id
      ? collectionSelectedData.id
      : db.getLocalStorage('last-collection') || 'nfty'
    await this.setCollectionSelected(lastViewedCollection)
    console.log('push route', `${this.$route.fullPath}/${lastViewedCollection}`)
    // this.$router.push({
    //   path: `${this.$route.fullPath}/${lastViewedCollection}`,
    // })
    console.log('loading false')
    this.$store.dispatch('setContentLoading', false)
    console.log('collection created done')
  },
}
</script>

<template>
  <!-- <p>test</p> -->
  <!-- v-if="!$store.state.contentLoading" -->
  <component :is="componentMounted"></component>
</template>

<style scoped></style>
