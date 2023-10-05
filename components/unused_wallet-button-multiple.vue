<script>
import loopring from '@/services/loopring.js'
import wallet from '@/services/wallet.js'
export default {
  name: 'wallet-button-multiple',
  data: () => ({
    providers: {
      gamestop: {
        isActive: false,
        logo: 'gamestop-logo.png',
        name: 'gamestop',
      },
      loopring: {
        isActive: false,
        logo: 'loopring-logo.jpg',
        name: 'loopring',
      },
      metamask: {
        isActive: false,
        logo: 'metamask-logo.ico',
        name: 'metmask',
      },
    },
  }),
  methods: {
    async connectWallet() {
      const walletAddress = await wallet.connectWallet()
      console.log(window.ethereum)
      console.log(walletAddress)
      //test
      const account = await loopring.getAccountByWalletAddress(walletAddress)
      console.log(account)
      const balances = await loopring.getUserNftBalances(account.accountId)
      console.log(balances)
    },
  },
}
</script>
<template>
  <div>
    <button
      v-for="provider in providers"
      :key="provider.name"
      class="nes-btn is-primary"
      @click="connectWallet"
    >
      <i class="nes-icon coin is-small"></i>
      <img
        :src="`/${provider.logo}`"
        :alt="`${provider.name} logo `"
        class="wallet-icon"
      />
      <!-- WALLET -->
    </button>
  </div>
</template>

<style scoped>
.wallet-icon {
  height: 1.5rem;
  width: 1.5rem;
}
</style>
