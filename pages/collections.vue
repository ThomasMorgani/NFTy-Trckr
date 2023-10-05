<script>
import { mapState } from 'vuex'
import CollectionEdit from '@/components/collection-edit.vue'
import ErrorMessage from '~/components/error-message.vue'
import Loader from '@/components/loader.vue'
// import NftItem from '~/components/nft-item.vue'
import NftDetailed from '@/components/nft-detailed.vue'
import Modal from '@/components/modal.vue'

import collectionMixin from '@/mixins/collection-mixin.vue'
import db from '@/services/db.js'

export default {
  name: 'collections',
  components: {
    CollectionEdit,
    ErrorMessage,
    Loader,
    // NftItem,
    NftDetailed,
    Modal,
  },
  meta: {
    view: 'collections',
  },
  mixins: [collectionMixin],
  computed: {
    ...mapState({
      contentLoading: (state) => state.contentLoading,
      connectedWallet: (state) => state.connectedWallet,
      modal: (state) => state.modal,
      scrollElementPos: (state) => state.scrollElementPos,
      view: (state) => state.view,
      walletError: (state) => state.walletError,
    }),
  },
  methods: {
    onContentScroll(e) {
      this.$store.dispatch('setScrollElementPos', e.target.scrollTop)
    },
  },
  watch: {
    //TODO: current hack, went a dif direction with layouts
    //see default template, move to content comp?
    //passing element ref to state cause recursion error
    scrollElementPos(curr, prev) {
      if (curr !== prev && curr === 0)
        this.$refs.collectionContent.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
    },
  },
  async created() {
    //   console.log(history)
    //   console.log('hello from collections')
    //   console.log(this.$route)
    if (!this?.collections?.length) {
      let collections = await db.getAll('collections')
      this.$store.dispatch('setCollections', collections)
    }
    //   if (this.view) {
    //     if (this.view === 'collection') {
    //       if (this?.$route?.params?.item) {
    //         this.onOpenCollection(this.$route.params.item)
    //       }
    //     }
    //   }
  },
}
</script>
<template>
  <section
    ref="collectionContent"
    class="section collection-section flex-column flex-grow"
    :class="{ 'disable-scroll': modal }"
    @scroll="onContentScroll"
  >
    <loader v-if="contentLoading" class="loader" />
    <NuxtChild v-else />

    <!-- @addNftToCollection="addNftToCollection"
        @removeNftFromCollection="removeNftFromCollection"
        @showDetails="showNftDetailModal" -->
    <collection-edit
      v-if="modal === 'collection-edit'"
      :key="modal"
    ></collection-edit>
    <nft-detailed v-if="modal === 'nft-detailed'"></nft-detailed>
    <nft-add v-if="modal === 'nft-add'"></nft-add>
  </section>
</template>

<style lang="css" scoped>
.collection-section {
  flex-wrap: wrap;
  align-content: stretch;
  justify-content: start;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--background-color-dark);
}

.loader {
  /* top: -90px; */
}

.nft {
  word-wrap: normal;
  overflow-wrap: anywhere;
  white-space: wrap;
}
</style>
