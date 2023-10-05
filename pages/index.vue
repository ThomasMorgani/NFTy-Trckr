<script>
import CommentCard from '@/components/comment-card.vue'
import WalletButton from '@/components/wallet-button.vue'

export default {
  name: 'NftyRedditTracker',
  components: {
    CommentCard,
    WalletButton,
  },
  computed: {},
  methods: {},
  async mounted() {
    console.log('welcome')
  },
}
</script>

<template>
  <section class="section flex-row align-center content-center full-width">
    <article class="nes-container  is-dark">
      <p class="nes-text is-primary">Welcome to NFTy-Trckr!</p>
      <p  class="mt">A utility suite to organize, find, track and distribute NFTs.</p>
      <p class="mt">All app data is saved to this local browser only. Use import/export settings to transfer. </p>
      <p class="mt">Current enabled networks:
        <ul>
          <li>Ethereum Loopring L2</li>
        </ul>
      </p>
      <p class="nes-text is-warning mt">
       App is under active development.
      </p>
          <a href="https://www.github.com/repo" target="_blank" class="github-link nes-text is-warning">
        <i class="nes-icon github"></i>
       Get full source and contribute here.

      </a>
    </article>
      <!-- <ul>
        <li>Send, batch send</li>
        <li>Improved social integration.</li>
      </ul>
    </article> -->
    <!-- <article class="nes-container full-width has-title is-dark">
      <p class="tile">Status</p>
      <p>Show configuration status, btns to handle</p>
    </article> -->
  </section>
</template>

<style scoped>

.nes-container {
  max-width: 900px;
}
.github-link {
  font-size: .75rem;
}
.github-link i{
  /* height: 10px;
  width: 10px; */
  margin: 0;
   transform: unset;
}
</style>
