<script>
import { mapGetters, mapState } from 'vuex'
import tooltipWrapper from './tooltip-wrapper.vue'

export default {
  components: { tooltipWrapper },
  name: 'header-buttons',
  props: {
    showFilters: {
      type: Boolean,
      required: true,
    },
  },
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
    addBtn() {
      const props = {
        disabled: false,
        title: '',
      }
      if (!this.subView) {
        props.disabled = true
        return props
      }

      if (this.view === 'collections') {
        if (this.subView !== 'all') {
          props.disabled = this.collectionSelectedData?.isWallet
          props.title = this.collectionSelectedData?.isWallet
            ? 'Collection is a wallet.'
            : 'Add a new nft to the selected collection.'
          return props
        }
        props.title = 'Add new collection.'
        return props
      }

      return props
    },
    hasFilters() {
      return Object.values(this.filters).filter((f) => f).length > 0
    },
    refreshDisabled() {
      return this.subView === 'all' || !this.connectedWallet
      // || !this.collectionSelectedData?.isWallet
    },
  },
}
</script>

<template>
  <div class="bottom-btns flex-row flex-end">
    <!-- <button @click="apikeyTest">T</button> -->
    <!-- TODO:
            MOVE TO BTN COMPONENT
            MAKE FILTER BTN COMPONENT
            TOGGLE FILTERS
            COLORS: disabled (off), primary (show), success (filterd applied)
             -->
    <tooltip-wrapper text="Toggle filters.">
      <button
        class="action-btn nes-btn pointer is-primary"
        :class="showFilters ? '' : 'is-off'"
        @click="$emit('filterBtn')"
      >
        <img src="/funnel-white.png" class="refresh-icon" />
      </button>
    </tooltip-wrapper>

    <tooltip-wrapper
      text="Refresh data from blockchain."
      :subtext="!connectedWallet ? '(wallet not connected)' : ''"
    >
      <button
        :disabled="refreshDisabled"
        class="action-btn nes-btn ml"
        :class="refreshDisabled ? 'is-disabled' : 'is-success'"
        @click="$emit('refreshBtn')"
      >
        <img
          src="/refresh-icon.png"
          class="refresh-icon"
          :class="{ rotate: contentLoading }"
        />
      </button>
    </tooltip-wrapper>
    <tooltip-wrapper :text="addBtn.title">
      <button
        :disabled="addBtn.disabled"
        class="action-btn nes-btn ml"
        :class="addBtn.disabled ? 'is-disabled' : 'is-success'"
        @click="$emit('addBtn')"
      >
        <img src="/plus-white.png" class="refresh-icon" />
      </button>
    </tooltip-wrapper>
  </div>
</template>

<style scoped>
@media screen and (max-width: 700px) {
  .bottom-btns {
    padding-top: 1rem;
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }
  .bottom-btns > span {
    flex-basis: 25%;
  }

  .bottom-btns button {
    width: 100%;
    margin: 0;
  }
}
</style>
