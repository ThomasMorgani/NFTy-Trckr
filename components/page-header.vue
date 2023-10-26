<script>
export default {
  name: 'page-header',
  data: () => ({
    componentsMap: {
      collections: 'collections',
      market: 'market',
    },
  }),
  components: {
    collections: () => import('@/components/header-collections.vue'),
    market: () => import('@/components/header-market.vue'),
  },
}
</script>
<template>
    <section v-if="componentsMap[$store.state.view]" class="page-header nes-container is-rounded with-title">
      <component :is="componentsMap[$store.state.view]"></component>
    </section>
</template>

<style scoped>
.page-header {
  position: sticky;
  top: var(--header-height);
  /* padding-bottom: 1rem;
  padding-top: 0px; */
  /* padding-top: var(--spacing-small); */
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--background-color);
  /* overflow: hidden; */
}
</style>
