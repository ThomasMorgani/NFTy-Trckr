<script>
import { mapGetters, mapState } from 'vuex'
import SortSelect from '@/components/sort-select.vue'
import SearchInput from '@/components/search-input.vue'
export default {
  name: 'filters',
  components: {
    SortSelect,
    SearchInput,
  },
  computed: {
    ...mapState({
      // contentLoading: (state) => state.contentLoading,
      // filters: (state) => state.filters,
      // subView: (state) => state.subView,
      // view: (state) => state.view,
    }),
    // hasFilters() {
    //   return Object.values(this.filters).filter((f) => f).length > 0
    // },
    searchInput: {
      get() {
        return this.filters.search
      },
      set(v) {
        this.$store.dispatch('setFilters', { ...this.filters, search: v })
      },
    },
  },
}
</script>

<template>
  <div class="filters-section full-width flex-row">
    <search-input></search-input>
    <sort-select></sort-select>
  </div>
</template>

<style scoped>
.filters-section {
  align-items: flex-start;
  justify-content: space-between;
  min-height: 120px;
  gap: var(--spacing-s);
}

@media screen and (max-width: 620px) {
  .filters-section {
    flex-direction: column;
  }
}

.filters-section > * {
  flex: 1;
}
</style>
