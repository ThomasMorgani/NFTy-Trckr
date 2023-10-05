<script>
export default {
  name: 'model-viewer-wrapper',
  props: {
    nftMetaData: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const plugin = document.createElement('script')
    plugin.setAttribute(
      'src',
      '//ajax.googleapis.com/ajax/libs/model-viewer/3.0.1/model-viewer.min.js'
    )
    plugin.setAttribute('type', 'module')
    plugin.async = true
    document.head.appendChild(plugin)
  },
}
</script>
<template>
  <model-viewer
    class="nft"
    bounds="tight"
    enable-pan
    autoplay
    :src="nftMetaData?.animation_url"
    ar
    ar-modes="webxr scene-viewer quick-look"
    camera-controls
    environment-image="neutral"
    :poster="nftMetaData?.image"
    shadow-intensity="1"
  />
</template>

<style lang="css" scoped>
model-viewer.nft {
  width: 450px;
  height: 450px;
}
</style>
