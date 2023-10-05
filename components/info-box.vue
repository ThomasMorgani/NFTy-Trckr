<script>
export default {
  name: 'info-box',
}
</script>
<template>
  <div class="wrapper flex-column align-center justify-center">
    <article
      class="info-container nes-container is-dark is-centered with-title"
    >
      <slot></slot>
    </article>
    <img
      class="nes-avatar is-medium mt"
      alt="button to display nft details modal"
      src="/info-box.png"
    />
  </div>
</template>

<style>
/* clamp(minimum, preferred, maximum); */

.wrapper {
  max-width: 700px;
  width: 100%;
}

.info-container {
  text-align: left;
  width: 100%;
  max-width: 800px;
}
</style>
