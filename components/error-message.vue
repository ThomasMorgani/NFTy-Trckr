<template>
  <div class="nes-text is-error flex-row">
    <img
      class="nes-avatar"
      alt="bowser error icon image example"
      src="/bowser-icon.png"
      style="image-rendering: pixelated"
    />
    <!-- todo message container, array of errors -->
    <div class="message-section">
      <p v-for="message in messages()" :key="message" v-text="message">
        {{ message + 'xx' }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error-message',
  props: {
    error: {
      type: Object,
      default: () => ({ message: 'An unknown error has occurred' }),
    },
  },
  methods: {
    messages() {
      console.log(this.error?.messages || [this.error.message])
      return this.error?.messages || [this.error.message]
    },
  },
}
</script>

<style lang="css" scoped>
.nes-avatar {
  margin-right: 1rem;
}

.message-section {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  justify-items: center;
}
</style>
