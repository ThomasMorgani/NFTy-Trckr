<script>
export default {
  name: 'sort-select',
  data: () => ({
    sortOptionsMap: {
      collections: [
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a?.created_at - b?.created_at),
          hidden: false,
          key: 'created_at',
          text: 'Created Asc',
          value: 'created_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b?.created_at - a?.created_at),
          hidden: false,
          key: 'created_at',
          text: 'Created Desc',
          value: 'created_desc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a?.itemCount - b?.itemCount),
          hidden: false,
          key: 'itemCount',
          text: 'Nft Count Asc',
          value: 'nft_count_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b?.itemCount - a?.itemCount),
          hidden: false,
          key: 'itemCount',
          text: 'Nft Count Desc',
          value: 'nft_count_desc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a?.name?.localeCompare(b?.name)),
          hidden: false,
          key: 'name',
          text: 'Name Asc',
          value: 'name_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b?.name?.localeCompare(a?.name)),
          hidden: false,
          key: 'name',
          text: 'Name Desc',
          value: 'name_desc',
        },
      ],
      market: [
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a?.name.localeCompare(b?.name)),
          hidden: false,
          isDefault: true,
          key: 'name',
          text: 'Name Asc',
          value: 'name_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b?.name.localeCompare(a?.name)),
          hidden: false,
          key: 'name',
          text: 'Name Desc',
          value: 'name_desc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a?.price - b?.price),
          hidden: false,
          isDefault: true,
          key: 'price',
          text: 'Price Asc',
          value: 'price_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b?.price - a?.price),
          hidden: false,
          key: 'price',
          text: 'Price Desc',
          value: 'price_desc',
        },
        {
          disabled: false,
          fn: (items) =>
            items.sort((a, b) => a?.symbol.localeCompare(b?.symbol)),
          hidden: false,
          isDefault: true,
          key: 'symbol',
          text: 'Symbol Asc',
          value: 'symbol_asc',
        },
        {
          disabled: false,
          fn: (items) =>
            items.sort((a, b) => b?.symbol.localeCompare(a?.symbol)),
          hidden: false,
          key: 'symbol',
          text: 'Symbol Desc',
          value: 'symbol_desc',
        },
      ],
      collection: [
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a?.created_at - b?.created_at),
          hidden: false,
          key: 'created_at',
          text: 'Created Asc',
          value: 'created_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b?.created_at - a?.created_at),
          hidden: false,
          key: 'created_at',
          text: 'Created Desc',
          value: 'created_desc',
        },
        {
          disabled: false,
          fn: (items) =>
            items.sort((a, b) =>
              a?.metadata?.name.localeCompare(b?.metadata?.name)
            ),
          hidden: false,
          key: 'name',
          text: 'Name Asc',
          value: 'name_asc',
        },
        {
          disabled: false,
          fn: (items) =>
            items.sort((a, b) =>
              b?.metadata?.name.localeCompare(a?.metadata?.name)
            ),
          hidden: false,
          key: 'name',
          text: 'Name Desc',
          value: 'name_desc',
        },
      ],
      shared: [
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a?.updated_at - b?.updated_at),
          hidden: false,
          key: 'updated_at',
          text: 'Updated Asc',
          value: 'updated_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b?.updated_at - a?.updated_at),
          hidden: false,
          key: 'updated_at',
          text: 'Updated Desc',
          value: 'updated_desc',
        },
      ],
    },
  }),
  computed: {
    sortOptions() {
      // const subview =
      //   this.$store?.state?.subView === 'all'
      //     ? 'collection'
      //     : this.$store?.state?.subView || ''
      const subView = this.$store?.state?.subView || ''
      if (this.sortOptionsMap[subView]) {
        const options = [
          ...this.sortOptionsMap.shared,
          ...this.sortOptionsMap[subView],
        ]
        return options.sort((a, b) => a?.text.localeCompare(b?.text))
      }

      const view = this.$store?.state?.view
      if (this.sortOptionsMap[view]) {
        return this.sortOptionsMap[view]
      }
      return []
    },
    sortSelect: {
      get() {
        return this.$store.state.filters.sortSelect
      },
      set(v) {
        this.$store.dispatch('setFilters', {
          ...this.$store.state.filters,
          sortSelect: v,
        })
      },
    },
  },
  created() {
    let select = null
    select = this.sortOptions.find((o) => o.isDefault)
    if (!select) {
      console.log('not select')
      const defaultSelection = 'name_asc'
      select = this.sortOptions.find((o) => o.value === defaultSelection)
    }
    this.sortSelect = select
  },
}
</script>
<template>
  <div class="select-wrapper full-width">
    <label for="sort-select">Sort by</label>
    <div class="nes-select">
      <select v-model="sortSelect" required id="sort-select">
        <option
          v-for="option in sortOptions"
          :key="option.value"
          :value="option"
          :disabled="option.disabled === true"
          :selected="option.value === sortSelect.value"
          :hidden="option.hidden"
          v-html="option.text"
        ></option>
      </select>
    </div>
  </div>
</template>

<style scoped></style>
