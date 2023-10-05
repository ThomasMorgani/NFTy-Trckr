<script>
export default {
  name: 'page-header',
  data: () => ({
    componentsMap: {
      collections: 'collections',
    },
  }),
  components: {
    collections: () => import('@/components/header-collections.vue'),
  },
}
</script>
<template>
  <!-- TODO: WE CAN USE ONE COMPONENT FOR ALL VIEWS, MAKE COMP -->
  <!-- <component :is="componentsMap[$route.name]"></component> -->
  <component :is="componentsMap[$store.state.view]"></component>
</template>

<style lang="scss" scoped></style>
