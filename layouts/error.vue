<script>
import BaseView from '@/components/base-view.vue'
export default {
  name: 'error-page',
  components: {
    BaseView,
  },
}
</script>

<template>
  <!-- <div
    class="container flex-column flex-no-wrap content-center align-center loader"
  >
    <div class="img-container">
      <img
        src="/lakitu-reverse.gif"
        alt="loading content gif of lakitu holding a stoplight"
      />
    </div>
    <p class="nes-text">Page not found</p>
  </div> -->
  <div class="flex-column align-center content-center">
    <div class="img-container mb">
      <img
        src="/lakitu-reverse.gif"
        alt="loading content gif of lakitu holding a stoplight"
      />
    </div>
    <h1 class="nes-text is-error">Page not found.</h1>
  </div>
</template>

<style lang="css" scoped>
.container {
  height: 100%;
  width: 100%;
}

h1 {
  font-size: 1.5rem;
}

.img-container {
  max-width: 170px;
  position: relative;
  overflow: hidden;
}
.loader {
  position: relative;
  z-index: 9;
}
.img-container img {
  object-fit: contain;
  object-position: -32px center;
  width: 200px;
}
</style>
