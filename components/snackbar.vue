<script>
import { mapState } from 'vuex'
export default {
  name: 'snackbar',
  computed: {
    ...mapState({
      snackbar: (state) => state.snackbar,
    }),
  },
  methods: {
    messageText() {
      const text = this.snackbar?.text?.split('/n') || ['Something went wrong.']
      // return text.slice(0, text.length - 1)
      return text
    },
  },
}
</script>

<template>
  <section
    class="snackbar-wrapper"
    :class="
      snackbar.show === null
        ? 'hidden'
        : snackbar.show
        ? 'slide-up'
        : 'slide-down'
    "
  >
    <img class="kirby" src="/kirby-icon.png" />
    <!-- Balloon -->
    <div class="nes-balloon from-left">
      <p v-for="(text, k) in messageText()" :key="`${text}${k}`">
        {{ text }}
      </p>
    </div>
  </section>
</template>

<style lang="css" scoped>
.hidden {
  visibility: hidden;
}

.snackbar-wrapper {
  pointer-events: none;
  position: fixed;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100vw;
  /* bottom: 0.25rem; */
  z-index: 6969;
}

.slide-up {
  animation: slide-from-bottom 1s ease-in-out forwards;
}

.slide-down {
  animation: slide-to-bottom 1s ease-in-out forwards;
}

.kirby {
  height: 6rem;
  width: 6.75rem;

  /* position: absolute;
  bottom: 0; */
}

.nes-balloon {
  color: #000;
  margin-bottom: 5.5rem;
  margin-left: -2rem;
  /* position: absolute;
  top: -1rem;
  right: -1rem; */
}

@keyframes slide-from-bottom {
  0% {
    bottom: -20rem;
  }
  100% {
    bottom: 0.5rem;
  }
}
@keyframes slide-to-bottom {
  0% {
    bottom: 0.5rem;
  }
  100% {
    bottom: -20rem;
  }
}
</style>
