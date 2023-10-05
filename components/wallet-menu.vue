<script>
import { mapState } from 'vuex'
export default {
  name: 'wallet-menu',
  computed: {
    ...mapState({
      connectedAccount: (state) => state.connectedAccount,
      connectedWallet: (state) => state.connectedWallet,
    }),
  },
}
</script>

<template>
  <div class="card nes-container is-rounded is-dark flex-column full-width">
    <div class="flex-row pb-s">
      <span
        class="status-icon nes-text"
        :class="connectedWallet ? 'is-success' : 'is-error'"
        >&#11044;</span
      >
      <p class="text-no-wrap m0">
        WALLET
        {{ connectedWallet ? '' : 'NOT' }} CONNECTED
      </p>
    </div>

    <button
      id="connect-btn"
      type="button"
      @click="$emit('connectWallet')"
      class="nes-btn full-width"
      :class="connectedWallet ? 'is-error' : 'is-success'"
    >
      {{ connectedWallet ? 'DISCONNECT' : 'CONNECT' }}
    </button>
    <!--
      pickup here
      connection status
      connect button (big square connect, small red top discnnect)
      nft count
      tokens
     -->
  </div>
</template>

<style scoped>
.card {
  height: auto;
}

.status-icon {
  margin-bottom: 10px;
  margin-right: 14px;
}
</style>
