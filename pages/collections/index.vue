<script>
import BaseView from '@/components/base-view.vue'

export default {
  components: { BaseView },
}
</script>

<template>
  <base-view>
    <template v-slot:title>COLLECTIONS</template>
    <template v-slot:image> <img src="/pokedex.png" alt="" /> </template>
    <template v-slot:info-box>
      <p class="text-left mb">Organize NFTs into custom groups.</p>
      <p class="text-left">
        Collections can be used to monitor wallets and track holders.
      </p>
    </template></base-view
  >
</template>

<style lang="css" scoped>
img {
  width: 150px;
  margin-bottom: 2rem;
}
</style>
