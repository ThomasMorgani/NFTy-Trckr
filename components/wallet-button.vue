<script>
import { mapState } from 'vuex'

import WalletMenu from '@/components/wallet-menu'
import NftMixin from '@/mixins/nft-mixin.vue'

import db from '@/services/db.js'
import loopring from '@/services/loopring.js'
import utils from '@/services/utils.js'
import wallet from '@/services/wallet.js'

export default {
  name: 'wallet-button',
  props: {
    withText: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    WalletMenu,
  },
  mixins: [NftMixin],
  data: () => ({
    showMenu: false,
  }),
  computed: {
    ...mapState({
      apiKeys: (state) => state.apiKeys,
      collectionSelect: (state) => state.collectionsHeader.collectionSelect,
      connectedAccount: (state) => state.connectedAccount,
      connectedWallet: (state) => state.connectedWallet,
    }),
  },
  methods: {
    async connectWallet() {
      const providerAddress = await wallet.getConnectedWalletCurrentAddress()
      console.log(providerAddress)
      if (this.connectedAccount?.owner === providerAddress) {
        //TODO: TOGGLE WALLET MENU
        console.log(this.connectedWallet)
        console.log('wallet connected...disconnect here')
      }

      const walletAddress = await wallet.connectWallet()
      console.log(walletAddress)
      if (!walletAddress) {
        this.$store.dispatch('setSnackbar', {
          show: true,
          text: 'No valid wallets found.',
        })
        return
      }

      // this.$store.dispatch('setContentLoading', true)
      const account = await loopring.getAccountByWalletAddress(walletAddress)
      console.log(account)

      if (account.error) {
        this.$store.dispatch('setWalletError', account)
        return
      }

      if (!this.apiKeys.loopring?.[providerAddress]) {
        try {
          const apiKey = await loopring.getApiKey(null, account)
          console.log(apiKey)
          this.$store.dispatch('setApiKeys', {
            ...this.apiKeys,
            loopring: {
              ...this.apiKeys.loopring,
              [account.owner]: apiKey,
            },
          })
          this.$store.dispatch('setConnectedWallet', walletAddress)
          this.$store.dispatch('setConnectedAccount', account)
        } catch (e) {
          console.log('did not receive an apiKey')
          console.log(e)
          console.log(e.message)

          this.$store.dispatch('setSnackbar', {
            show: true,
            text: 'Wallet not connected.',
          })
          this.showMenu = false
          // this.$store.dispatch('setContentLoading', false)
          return
        }
      }
      // const walletAddress = '0xc9441e2bc85bE9fD27E34c7C1424aBa40c83A8fA' //NFTyTrckr wallet
      this.$emit('walletConnected', walletAddress)
      this.$store.dispatch('setSnackbar', {
        show: true,
        text: 'Wallet connected!',
      })
      this.$store.dispatch('setContentLoading', false)
    },
    onMenuFocus(e) {
      console.log(e)
    },
    onMenuFocusOut(e) {
      //let button logic handle
      console.log('focus out')
      console.log(e)
      const el = e.relatedTarget || e.srcElement || null
      if (el?.id === 'wallet-btn' || el?.id === 'connect-btn') return

      this.showMenu = false
    },
    onMenuToggle() {
      console.log('on menu toggle')
      this.showMenu = !this.showMenu
      if (this.showMenu) {
        console.dir(this.$refs.menu)
        this.$refs.menu.focus()
      }
    },
  },
}
</script>
<template>
  <span class="menu-wrapper">
    <button
      id="wallet-btn"
      class="wallet-btn nes-btn fade-in"
      :class="`is-${connectedWallet ? 'success' : 'error'}`"
      @click="onMenuToggle"
    >
      <i class="nes-icon coin is-small"></i>
      <span class="btn-text">
        <!-- {{ withText ? 'WALLET' : '' }} -->
        WALLET
      </span>
    </button>
    <aside
      id="menu"
      ref="menu"
      tabindex="1"
      class="menu-content"
      :class="{ show: showMenu }"
      @focus="onMenuFocus"
      @focusout="onMenuFocusOut"
    >
      <wallet-menu @connectWallet="connectWallet">
        <!-- @click="connectWallet" -->
      </wallet-menu>
    </aside>
  </span>
</template>

<style scoped>
.menu-wrapper {
  position: relative;
}
.wallet-btn {
  white-space: nowrap;
}

.menu-content {
  position: absolute;
  right: 0px;
  width: 420px;
  z-index: 9;
  height: 0px;
  overflow: hidden;
  transition: height 0.2s linear;
}

.menu-content.show {
  height: 400px;
  transition: height 0.4s linear;
}

@media screen and (max-width: 550px) {
  .btn-text {
    display: none;
  }
}

@media screen and (min-width: 700px) and (max-width: 900px) {
  .btn-text {
    display: none;
  }
}

@media screen and (max-width: 700px) {
  /* .wallet-btn {
    margin-left: auto;
    align-self: end;
  } */
}
/* @media screen and (max-width: 700px) {
  .wallet-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
} */
</style>
