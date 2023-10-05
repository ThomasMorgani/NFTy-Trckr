<script>
import Modal from '@/components/modal.vue'
export default {
  data: () => ({ showDialog: false }),
  components: {
    Modal,
  },
  methods: {
    toggleDialog() {
      this.$store.dispatch('toggleModal', 'about')
    },
  },
}
</script>
<template>
  <footer class="flex-row full-width">
    <tooltip-wrapper text="🦍✊">
      <div
        class="info-activator nes-icon heart pointer"
        @click="toggleDialog"
      ></div>
    </tooltip-wrapper>
    <tooltip-wrapper text="Settings" class="ml-auto">
      <img
        src="/chest-icon.png"
        class="settings-activator pointer"
        @click="toggleDialog"
      />
    </tooltip-wrapper>
    <modal :isOpen="$store.state.modal === 'about'">
      <h2 class="title">POWER TO</h2>
      <section class="link-section flex-column full-width pa" @click.stop="">
        <span>
          <!-- <i class="nes-logo"></i> -->
          <a href="https://www.gamestop.com" target="_blank">THE PLAYERS</a>
        </span>
        <span>
          <!-- <i class="nes-pokeball"></i> -->
          <a href="https://www.loopring.io" target="_blank">THE COLLECTORS</a>
        </span>
        <span>
          <!-- <img src="/mario-hammer.png" alt="" /> -->
          <a href="https://beyourownarcade.com/" target="_blank"
            >THE CREATORS</a
          >
        </span>
        <span>
          <!-- <img src="/mario-star.png" alt="" /> -->
          <a href="https://www.drsgme.org" target="_blank">THE PEOPLE</a>
        </span>
      </section>
      <a href="https://www.github.com/repo" target="_blank">
        <i class="nes-icon github"></i>
      </a>
    </modal>
  </footer>
</template>

<style lang="css" scoped>
footer {
  display: flex;
  align-content: center;
  position: fixed;
  bottom: 0px;
  inset-inline: 0px;
  height: 4rem;
  padding: 1rem;
  background-color: var(--background-color);
  justify-content: flex-start;
  z-index: 5;
}

img {
  height: 4rem;
}

.info-activator {
  margin: 0px;
  transform-origin: unset;
  /* height: 32px; */
  /* width: 32px; */
}

.settings-activator {
  height: 32px;
  width: 32px;
}

.title {
  margin: 0;
}

.link-section {
  align-items: center;
  height: 100%;
  width: 30rem;
}
</style>
