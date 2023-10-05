<script>
import CollectionItemList from '@/components/collection-item-list.vue'
export default {
  name: 'collections_keyword',
  components: { CollectionItemList },
}
</script>
<template>
  <collection-item-list></collection-item-list>
</template>

<style lang="css" scoped>
.collection-item-list {
  padding-bottom: 200px;
}
</style>
