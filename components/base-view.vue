<script>
import InfoBox from '@/components/info-box.vue'
export default {
  name: 'base-view',
  components: { InfoBox },
}
</script>
<template>
  <div class="base-container flex-column">
    <h2 class="title">
      <slot name="title"></slot>
    </h2>
    <div class="mb">
      <slot name="image"></slot>
    </div>
    <div>
      <info-box class="info-box">
        <slot name="info-box"> </slot>
      </info-box>
    </div>
  </div>
</template>

<style scoped>
.base-container {
  height: 100%;
}
.info-box {
  align-self: end;
  margin-block: auto;
  flex-grow: 1;
}
</style>
