<script>
export default {
  name: 'search-input',
  computed: {
    searchInput: {
      get() {
        return this.$store.state.filters.search
      },
      set(v) {
        this.$store.dispatch('setFilters', {
          ...this.$store.state.filters,
          search: v,
        })
      },
    },
  },
}
</script>
<template>
  <div class="search-wrapper full-width">
    <label for="search-input">Search</label>
    <div class="pos-relative nes-field">
      <input
        v-model="searchInput"
        type="text"
        id="search-input"
        class="nes-input is-dark"
      />
      <button
        v-if="searchInput?.length"
        @click="searchInput = ''"
        class="clear-btn nes-btn"
      >
        &#x2716;
      </button>
    </div>
  </div>
</template>

<style scoped>
.clear-btn {
  position: absolute;
  right: 10px;
  top: 12px;
  display: flex;
  align-items: center;
  height: 25px;
  width: 25px;
  padding: 0px;
  z-index: 2;
  font-weight: bold;
  font-size: 1.25rem;
}
.clear-btn::after {
  box-shadow: inset -2px -2px #adafbc;
}
</style>
