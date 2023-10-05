<template>
  <div class="flex-column loader">
    <img
      src="/lakitu-stoplight.gif"
      alt="loading content gif of lakitu holding a stoplight"
    />
    <p class="nes-text">loading...</p>
  </div>
</template>

<style lang="css" scoped>
.loader {
  position: relative;
  z-index: 9;
}
.loader img {
  width: 100px;
}
</style>
