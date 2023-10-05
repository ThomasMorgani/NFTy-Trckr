<script>
export default {
  name: 'sort-select',
  data: () => ({
    sortOptionsMap: {
      collection: [
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a.created_at - b.created_at),
          hidden: false,
          key: 'created_at',
          text: 'Created Asc',
          value: 'created_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b.created_at - a.created_at),
          hidden: false,
          key: 'created_at',
          text: 'Created Desc',
          value: 'created_desc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a.itemCount - b.itemCount),
          hidden: false,
          key: 'itemCount',
          text: 'Nft Count Asc',
          value: 'nft_count_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b.itemCount - a.itemCount),
          hidden: false,
          key: 'itemCount',
          text: 'Nft Count Desc',
          value: 'nft_count_desc',
        },
      ],
      nft: [
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a.created_at - b.created_at),
          hidden: false,
          key: 'created_at',
          text: 'Created Asc',
          value: 'created_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b.created_at - a.created_at),
          hidden: false,
          key: 'created_at',
          text: 'Created Desc',
          value: 'created_desc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a.name.localeCompare(b.name)),
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
          fn: (items) => items.sort((a, b) => a.name.localeCompare(b.name)),
          hidden: false,
          key: 'name',
          text: 'Name Asc',
          value: 'name_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b.name.localeCompare(a.name)),
          hidden: false,
          key: 'name',
          text: 'Name Desc',
          value: 'name_desc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => a.updated_at - b.updated_at),
          hidden: false,
          key: 'updated_at',
          text: 'Updated Asc',
          value: 'updated_asc',
        },
        {
          disabled: false,
          fn: (items) => items.sort((a, b) => b.updated_at - a.updated_at),
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
      const subview =
        this.$store?.state?.subView === 'all'
          ? 'collection'
          : this.$store?.state?.subView || ''
      console.log(subview)
      if (this.sortOptionsMap[subview]) {
        const options = [
          ...this.sortOptionsMap.shared,
          ...this.sortOptionsMap[subview],
        ]
        console.log(options)
        return options.sort((a, b) => a.text.localeCompare(b.text))
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
    const defaultSelection = 'name_asc'
    console.log(this.sortOptions)
    console.log(this.sortOptions.find((o) => o.value === defaultSelection))
    this.sortSelect = this.sortOptions.find((o) => o.value === defaultSelection)
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
