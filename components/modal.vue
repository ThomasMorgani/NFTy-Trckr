<script>
export default {
  name: 'modal',
  props: {
    closeEvent: {
      type: Function,
    },
    closeOnOverlay: {
      type: Boolean,
      default: () => false,
    },
    isOpen: {
      type: Boolean,
      default: () => false,
    },
    overlayEvent: {
      type: Function,
    },
    styleOverride: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    onClose() {
      if (this.closeEvent) {
        this.closeEvent()
      } else {
        this.toggleDialog()
      }
    },
    onOverlay() {
      if (this.overlayEvent) {
        this.overlayEvent()
        return
      }
      if (this.closeOnOverlay) {
        this.toggleDialog()
      }
    },
    toggleDialog() {
      this.$store.dispatch('setModalData', null)
      this.$store.dispatch('toggleModal')
    },
  },
  watch: {
    isOpen() {
      return this.$store.state.modal
    },
  },
  mounted() {
    if (this.isOpen) {
      const html = document.querySelector('html')
      html.style.setProperty('overflow-y', 'hidden')
    }
  },
  beforeDestroy() {
    const html = document.querySelector('html')
    html.style.removeProperty('overflow-y')
  },
}
</script>
<template>
  <div
    v-if="isOpen"
    :key="isOpen.toString()"
    @click="onOverlay"
    class="overlay"
  >
    <dialog
      ref="dialog"
      class="nes-dialog flex-column is-dark is-rounded with-title info-dialog"
      :open="isOpen"
      @click.stop=""
      :style="{ ...styleOverride }"
    >
      <button
        type="button"
        aria-label="Close"
        class="close-btn"
        @click="onClose"
      >
        &#10006;
      </button>

      <slot></slot>
    </dialog>
  </div>
</template>
<style lang="css" scoped>
dialog {
  /* width: unset; */
  /* height: unset; */
  /* margin: 0; */
}

dialog:not([open]) {
  display: none;
}

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* height: 100vh;
  width: 100vw; */
  background-color: #000000e6;
  z-index: 20;
  overflow-y: auto;
}
.nes-dialog {
  padding: 1.5rem 2rem;
  border-width: 4px;
}

.info-dialog {
  /* max-height: 99vh; */
  max-width: 90vw;
  /* margin: 5% auto; */
  top: 50%;
  /* transform: translateX(-50%); */
  transform: translateY(-50%);
}

.nes-dialog.is-rounded.is-dark {
  border-image-repeat: stretch;
}

.close-btn {
  background: none;
  color: white;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 0.1rem;
  right: 1rem;
}
</style>
