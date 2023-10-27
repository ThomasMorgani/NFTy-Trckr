<script>
import { mapState } from 'vuex'
import loopring from '@/services/loopring.js'
export default {
  name: 'wallet-menu',
  data: () => ({
    holdings: null,

  }), 
  computed: {
    ...mapState({
      connectedAccount: (state) => state.connectedAccount,
      connectedWallet: (state) => state.connectedWallet,
    }),
  },
  methods: {
    async onTest() {
      const tokenInfo = await loopring.getTokenInfo()
      console.log(tokenInfo)
    
    }
  },
  watch: {
    async connectedWallet(v) {
      if (v && !this.holdings) {
        //setInterval,  or on mount.. 
        //TODO: get market price
        const tokenInfo = await loopring.getTokenInfo()
        console.log(tokenInfo)
        if (this?.connectedAccount?.accountId) {
          const balances = await loopring.getAccountTokenBalancesLoopring(this.connectedAccount.accountId)
          console.log(balances)
          if (balances?.length) {
            const holdings = balances.map(balance => {
              console.log(balances)
              const token = tokenInfo.find(t => t.tokenId === balance.tokenId) 
              if (token) {
                let total = balance.total / Math.pow(10, token.decimals)
                // total = total == 0 ? 0 : total < 1 ? `0${total}` : total
                return {
                  address: token.address,
                  name: token.name,
                  symbol: token.symbol,
                  total,

                }
              }
            })
            this.holdings = holdings
          }
   
        }
      }

    }
  }
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
    <div v-if="holdings" class="flex-column flex-wrap align-start justify-content text-left full-width py-s">
      <h4 class="nes-text is-primary">Holdings</h4>
        <div v-for="holding in holdings" :key="holding.symbol" class="nes-text">{{ holding.symbol + ' ' + holding.total }}</div>
    </div>
<!-- <button @click="onTest">GET BALANCES</button> -->
    <button
      id="connect-btn"
      type="button"
      @click="$emit('connectWallet')"
      class="nes-btn full-width mt-auto"
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
  min-height: 240px;
}

.status-icon {
  margin-bottom: 10px;
  margin-right: 14px;
}
</style>
