<script>
import { mapGetters, mapState } from 'vuex'
import loopring from '@/services/loopring.js'
import db from '@/services/db.js'
import utils from '@/services/utils.js'

export default {
  name: 'collection-mixin',
  data: () => ({
    defaultCollection: {
      created_at: null,
      id: null,
      isWallet: false,
      itemCount: 0,
      name: '',
      note: '',
      updated_at: null,
      // wallet: {
      //   accountId: null,
      //   address: '',
      // },
    },
  }),
  computed: {
    ...mapGetters([
      // 'allCollections',
      // 'nftItemsDisplayed',
    ]),
    ...mapState({
      collectionItemsData: (state) => state.collectionItemsData,
      collections: (state) => state.collections,
      collectionItemsData: (state) => state.collectionItemsData,
      collectionSelectedData: (state) => state.collectionSelectedData,
      collectionSelectedItems: (state) => state.collectionSelectedItems,
      connectedWallet: (state) => state.connectedWallet,
      contentLoading: (state) => state.contentLoading,
      filters: (state) => state.filters,
      view: (state) => state.collectionsHeader.view,
      walletError: (state) => state.walletError,
    }),
    // async collectionItems() {
    //   if (!this.collectionSelectedData?.id) return []
    //   const items = await db.get(
    //     'collection-items',
    //     this.collectionSelectedData.id
    //   )
    //   return items
    // },
    nftItemsDisplayed() {
      //TODO: create method to filter items,
      //take array, searchables, search
      //TODO: create method sort
      //take array, key, direction
      const { search, sort } = this.filters
      let items = this.collectionItemsData || []
      if (search) {
        items = [
          ...items.filter((i) => {
            const {
              accountId,
              nftId,
              tokenAddress,
              uri,
              nftData,
              nftType,
              tokenId,
            } = i || ''
            const { name, description } = i?.metadata || ''

            const searchables = {
              accountId,
              nftId,
              tokenAddress,
              uri,
              nftData,
              nftType,
              tokenId,
              name,
              description,
            }
            const searchableString = Object.values(searchables).join('')
            return searchableString.toLowerCase().includes(search.toLowerCase())
          }),
        ]
      }
      return items
    },
    collectionsDisplayed() {
      const { search, sortSelect } = this.filters
      let collections = [...this.collections] || []
      if (search) {
        collections = [
          ...collections.filter((c) => {
            const searchable = {
              name: c.name,
              note: c.note,
            }
            const searchableString = Object.values(searchable).join('')
            return searchableString.toLowerCase().includes(search.toLowerCase())
          }),
        ]
      }

      if (sortSelect?.fn) {
        return sortSelect.fn([...collections])
      }
      return collections
      // return [...collections].sort((a, b) => b.updated_at - a.updated_at)
    },
  },
  methods: {
    async collectionUpsert(collection = {}) {
      const newCollection = { ...this.defaultCollection, ...collection }
      if (!collection.id) {
        newCollection.id = collection?.isWallet
          ? collection.address
          : utils.generateId()
        newCollection.created_at = new Date().getTime()
        newCollection.created_at_human = utils.epochToHuman(
          newCollection.created_at
        )
      }
      newCollection.updated_at = new Date().getTime()
      newCollection.updated_at_human = utils.epochToHuman(
        newCollection.updated_at
      )
      newCollection.isWallet = !!collection.address

      try {
        await db.put('collections', newCollection)
        const collections = [
          ...this.collections.filter((c) => c.id !== newCollection.id),
          { ...newCollection },
        ]
        this.$store.dispatch('setCollections', collections)
      } catch (e) {
        console.log(e)
      }
      // this.$store.dispatch('setCollections', [
      //   ...this.collections,
      //   this.collection,
      // ])
      // db.write('collections')
      // not saving items here, just meta
      // db.write([this.collection.id], this.collection)
    },
    async collectionDelete(collection) {
      try {
        await db.delete('collections', collection)
        const collections = this.collections.filter(
          (c) => c.id !== this.collection.id
        )
        this.$store.dispatch('setCollections', collections)
      } catch (e) {
        console.log(e)
      }
      // this.$store.dispatch('setCollections', [
      //   ...this.collections,
      //   this.collection,
      // ])
      // db.write('collections')
      // not saving items here, just meta
      // db.write([this.collection.id], this.collection)
    },
    collectionEdit(collection) {
      this.$store.dispatch('setModalData', collection)
      this.$store.dispatch('toggleModal', 'collection-edit')
    },
    collectionImage(collection) {
      //isNft joystick
      //isCustom pokedex
      //isWallet money bag
      return
    },
    setCollectionSelected(selected) {
      if (!selected) return false
      return new Promise(async (res, rej) => {
        const collection = selected?.id
          ? selected
          : await db.get('collections', selected)

        if (!collection) {
          console.log('unable to determine valid collection')
          return false
        }
        // if (!collection) return

        const items = await db.get('collection-items', collection?.id)
        this.$store.dispatch('setCollectionSelectedData', collection)
        this.$store.dispatch('setCollectionSelectedItems', items?.items || [])
        this.$store.dispatch('setCollectionItemsData', [])
        res('ww')
      })
    },
  },
}
</script>
