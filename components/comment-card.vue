<script>
import ClipboardContainer from '@/components/clipboard-container.vue'
import NftCard from '@/components/nft-card-tracker.vue'
export default {
  name: 'comment-card',
  components: {
    ClipboardContainer,
    NftCard,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    nftyArcadesById: {
      type: Object,
      required: true,
    },
  },
}
</script>
<template>
  <article class="nes-container is-rounded">
    <section class="flex-row message-top">
      <a :href="comment.authorProfile" target="_blank"
        ><h5 class="nes-text is-primary">{{ comment.author }}</h5></a
      >
      <h6 class="nes-text is-disabled">
        {{ new Date(comment.created * 1000).toLocaleString() || '' }}
      </h6>
    </section>
    <section class="message-body">
      <p>{{ comment.body }}</p>
      <div class="section-actions">
        <a :href="comment.permalink" target="_blank">
          <h6 class="nes-text is-disabled">
            ({{ comment.repliesCount }} replies)
          </h6></a
        >
        <button class="nes-btn reply-button">
          <i class="nes-icon reddit is-small"></i> reply
        </button>
      </div>
    </section>

    <clipboard-container
      :text="Wallet"
      :content="comment.parsedWallet || ''"
      :isDisabled="!comment.parsedWallet"
    >
      <p :class="!comment.parsedWallet && 'nes-text is-warning'">
        {{ comment.parsedWallet || 'Unable to detect' }}
      </p>
    </clipboard-container>

    <!-- <section class="nes-container with-title">
      <p class="title">Wallet (click to copy)</p>

    </section> -->
    <section class="nes-container with-title collection-container">
      <p class="title">Collection</p>
      <nft-card
        v-for="nft in comment.nftyBalances"
        :key="nft.nftId"
        :nft="nft"
        :nftyArcadesById="nftyArcadesById"
      ></nft-card>
    </section>
  </article>
</template>

<style scoped>
.message-top {
  justify-content: space-between;
}
.message-body {
  padding-block: 2rem;
}
.message-body .section-actions {
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.reply-button {
  background-color: #ff4400 !important;
  color: var(--primary-text) !important;
}

.reply-button::after {
  box-shadow: inset -4px -4px #990808 !important;
}

.nes-container {
  margin-bottom: 2rem !important;
}

.collection-container {
  /* padding-inline: 0 !important; */
}
</style>
