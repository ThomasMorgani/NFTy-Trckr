<script>
import CollectionItem from '~/components/collection-item.vue'
import collectionMixin from '@/mixins/collection-mixin.vue'
export default {
  name: 'collection-item-list',
  props: {
    collectionItems: {
      type: Array,
      default: () => [],
    },
  },
  components: { CollectionItem },

  mixins: [collectionMixin],
  data: () => ({}),
  computed: {},
  methods: {
    async addNftToCollection({ collection = {}, nft = {} }) {
      console.log('addNftToCollection')
      if (collection?.isWallet) return
      await this.setCollectionSelected(collection)
      this.$store.dispatch('setModalData', nft)
      this.$store.dispatch('toggleModal', 'nft-add')
    },
    async onOpenCollection(collection) {
      console.log('onOpenCollection')
      console.log(collection)
      // this.$router.push({ path: `/collections/collection/${collection.id}` })
      this.$store.dispatch('setContentLoading', true)
      await this.setCollectionSelected(collection)
      this.$store.dispatch('setSubView', 'collection')
      console.log('onOpenCollection ---- end')
    },
  },
  created() {},
}
</script>

<template>
  <transition-group
    name="list"
    class="collection-item-list full-width flex-column content-center"
  >
    <div
      v-if="!collectionsDisplayed.length && collections.length"
      key="msg"
      class="nes-container is-rounded is-dark full-width"
    >
      <p>No results found matching applied filters.</p>
    </div>
    <template v-else>
      <collection-item
        v-for="collection in collectionsDisplayed"
        :key="collection.id"
        :collection="collection"
        @addNftToCollection="addNftToCollection"
        @openCollection="onOpenCollection"
      ></collection-item>
    </template>
  </transition-group>
</template>

<style scoped>
.list-enter-active,
.list-leave-active,
.list-move {
  transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
}

.list-enter {
  opacity: 0;
  transform: translateX(50px) scaleY(0.5);
}

.list-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}

.list-leave-active {
  position: absolute;
}

.list-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}
</style>
