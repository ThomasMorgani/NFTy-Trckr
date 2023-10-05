import api from './api.js'
import web3 from 'web3'
const w3 = new web3(window.gamestop)
export default {
  async connectedWallets() {
    console.log('connectedWallets')
    if (!window.ethereum) return []
    const ethereum = window.ethereum
    const accounts = await ethereum.request({
      method: 'eth_accounts',
    })
    return accounts
  },
  async connectWallet() {
    //TODO: We will have network and wallet provider helpers.
    //for now just gamestop/loopring
    //
    // const ethereum = window.ethereum
    const walletProvider = window.gamestop
    console.log(walletProvider)
    if (!walletProvider) {
      return false
    }

    //walletProvider.connected

    walletProvider.on('connect', (message) =>
      console.log('WALLET CONNECT:' + message)
    )
    walletProvider.on('disconnect', (message) =>
      console.log('WALLET DIS:' + message)
    )
    walletProvider.on('message', (message) =>
      console.log('WALLET EVENT:' + message)
    )
    walletProvider.on('accountChanged', (message) =>
      console.log('WALLET ACCT CHANGE:' + message)
    )
    walletProvider.on('error', (message) =>
      console.log('WALLET ERROR:' + message)
    )

    try {
      const accounts = await walletProvider.request({
        method: 'eth_requestAccounts',
      }) // <<< ask for permission

      console.log('connected')

      console.log(walletProvider)
      console.log(accounts)
      return accounts[0] //always returns responding wallet
    } catch (e) {
      console.error('error connecting wallet')
      return e
    }
    // }
    console.log('wallet already connected')
    return walletProvider.currentAddress
  },
  async isConnected() {
    if (!window?.ethereum?.connected) return false
    const ethereum = window.ethereum
    const accounts = await ethereum.request({
      method: 'eth_accounts',
    })
    return accounts.length > 0
  },
  async getConnectedWalletCurrentAddress() {
    const walletProvider = window.gamestop
    return walletProvider?.currentAddress || null
  },
}
