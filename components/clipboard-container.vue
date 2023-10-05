<script>
export default {
  name: 'clipboard-container',
  props: {
    content: {
      type: String,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      default: () => true,
    },
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: false,
    },
  },
  data: () => ({ isCopying: false }),
}
</script>
<template>
  <section class="nes-container with-title is-dark">
    <p class="title">{{ title }}</p>
    <div class="main-container flex-row">
      <img
        class="nes-avatar is-medium"
        alt="copy to clip board"
        src="/clipboard-copy.png"
        style="image-rendering: pixelated"
      />
      <div class="content-section">
        <div class="content"><slot></slot></div>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
.nes-container {
  padding: 1rem;
}

.content-section {
  white-space: nowrap;
  overflow: auto;
  width: 60vw;
}

.content {
  display: inline-block;
}
</style>
