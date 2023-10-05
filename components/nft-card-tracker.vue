<script>
export default {
  name: 'nft-card-tracker',
  props: {
    nftyArcadesById: {
      type: Object,
      required: true,
    },
    nft: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    isCopyingWallet: false,
    isSent: false,
  }),
}
</script>
<template>
  <article class="nft-card">
    <section class="nft-thumbnail-container">
      <img
        :src="nftyArcadesById[nft.nftId].thumbnail"
        :alt="`thumbnail preview for ${nft.name}`"
        class="nft-thumbnail"
      />
    </section>
    <section class="nft-card-content">
      <a :href="nftyArcadesById[nft.nftId].url" target="_blank">
        <h4 class="nft-title">{{ nftyArcadesById[nft.nftId].name }}</h4></a
      >
      <!-- <h6 class="nes-text is-disabled">
        total: {{ nftyArcadesById[nft.nftId].dummyCount }}
      </h6> -->
      <h6 class="nes-text is-disabled">total: {{ nft.total }}</h6>
    </section>
    <section class="nft-card-actions">
      <label>
        <input type="checkbox" class="nes-checkbox" v-model="isSent" />
        <span class="nes-text" :class="isSent && 'is-success'">Sent</span>
      </label>
      <button type="button" class="nes-btn is-success send-button">
        <!-- send &#x279f; -->
        send
      </button>
    </section>
  </article>
</template>

<style lang="css" scoped>
.nft-card {
  display: flex;
  padding-block: 0;
  padding-inline: 1rem;
  border: 0;
  margin-bottom: 0.5rem;
}

.nft-thumbnail-container {
  display: flex;
  align-items: flex-start;
  justify-items: center;
  padding-block: 1rem;
}

.nft-thumbnail {
  height: 4.5rem;
  width: 4.5rem;
  border-radius: 0.15rem;
}

.nft-card-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-content: flex-start;
  justify-content: flex-start;
  padding: 1rem;
}

.nft-title {
  margin: 0;
}

.nft-card-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  padding-block: 1rem;
}

.send-button {
  /* display: flex;
  align-items: center;
  justify-items: center; */
}
</style>
