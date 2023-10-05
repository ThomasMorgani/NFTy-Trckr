// import web3 from 'web3'
// import loopringSDK from '@loopring-web/loopring-sdk'
// import numberToBN from 'number-to-bn'
import axios from 'axios'
// import LoopringAPI from '@loopring-web/loopring-sdk'

/*

    NOTES:


    TODO:



   INTERESTING ENDPOINTS:

   GS

   https://api.nft.gamestop.com/nft-svc-marketplace/getLoopringNftBalance?userEthAddress=0xA62C40b4c3A08BA9da949398F3208DCD0922F215&contractAddress=0x1d006a27bd82e10f9194d30158d91201e9930420&tokenId=0xc5308bea6b01712e6f68c00491734fd9e7d040ba5fb31fd808831e5ec3e290c5
  [{"contractAddress":"0x1d006a27bd82e10f9194d30158d91201e9930420","tokenId":"0xc5308bea6b01712e6f68c00491734fd9e7d040ba5fb31fd808831e5ec3e290c5","loopringNftData":"0x044816c8c78de5a90f41832435cd30493ad5a1108228c684aa3094b34e6b4ead","amount":"1","loopringTokenId":32912}]


  https://api.nft.gamestop.com/nft-svc-marketplace/getNft?tokenIdAndContractAddress=0xc5308bea6b01712e6f68c00491734fd9e7d040ba5fb31fd808831e5ec3e290c5_0x1d006a27bd82e10f9194d30158d91201e9930420
  {"nftId":"bd4048ae-c75a-48a1-9019-344c1379b565","tokenId":"0xc5308bea6b01712e6f68c00491734fd9e7d040ba5fb31fd808831e5ec3e290c5","contractAddress":"0x1d006a27bd82e10f9194d30158d91201e9930420","creatorEthAddress":"0x39dc73b6067f33f1225695059512fa889b8cef6b","name":"MetaBoy #3206","description":"","amount":"1","royaltyFeeBips":5,"copyright":null,"nftType":"ERC1155","mutable":false,"metadataUri":"ipfs://QmbcPxgQoG26CMviyfkH57pvCznRaoQYGunEx8EX2gBQyz","metadataJson":{"name":"MetaBoy #3206","image":"ipfs://QmXQoRQVoYZaWTxmcqPupSse6NJfKTCvyi1PcLGLkbRxC3","attributes":[{"value":"Kingdom","trait_type":"Background"},{"value":"Schoolgirl","trait_type":"Body"},{"value":"Demon","trait_type":"Face"},{"value":"Viking Helmet","trait_type":"Hat"},{"value":"Medallion Necklace","trait_type":"Neck"},{"value":"Blade","trait_type":"Weapon"}],"properties":{"Hat":"Viking Helmet","Body":"Schoolgirl","Face":"Demon","Neck":"Medallion Necklace","Weapon":"Blade","Background":"Kingdom"},"description":"","animation_url":"ipfs://QmXQoRQVoYZaWTxmcqPupSse6NJfKTCvyi1PcLGLkbRxC3","royalty_percentage":5},"mediaType":"image/gif","mediaUri":"ipfs://QmXQoRQVoYZaWTxmcqPupSse6NJfKTCvyi1PcLGLkbRxC3","mediaThumbnailUri":"ipfs://QmXQoRQVoYZaWTxmcqPupSse6NJfKTCvyi1PcLGLkbRxC3","preRevealMediaType":null,"preRevealMediaUri":null,"preRevealMediaThumbnailUri":null,"collectionId":"36fab6f7-1e51-49d9-a0be-39343abafd0f","revealed":true,"blocked":false,"state":"Active","firstMintedAt":"2022-03-27T04:16:14.758Z","likeCount":0,"loopringNftInfo":{"nftData":["0x044816c8c78de5a90f41832435cd30493ad5a1108228c684aa3094b34e6b4ead"]},"created_at":"2022-03-27T04:16:14.764Z","updatedAt":"2022-03-27T04:16:14.764Z"}abb



*/

import account from '../private/keys.json'
import moralis from '../private/moralis.json'

const LOOPRING_URL = 'https://api3.loopring.io/api/v3'
const MORALIS_URL = 'https://deep-index.moralis.io/api/v2'

const loopringOptions = {
  headers: {
    common: {
      // 'X-API-KEY': account.ApiKey,
      // 'X-API-SIG': '',
    },
  },
}
const moralisOptions = {
  headers: {
    common: {
      'X-API-KEY': moralis.web3ApiKey,
    },
  },
}

//
//
//
export default {
  hexToNumberString(value) {
    if (!value) return value

    if (typeof value === 'string' && !isHexStrict(value)) {
      throw new Error('Given value "' + value + '" is not a valid hex string.')
    }

    return toBN(value).toString(10)
  },
  toBN(number) {
    try {
      return numberToBN.apply(null, arguments)
    } catch (e) {
      throw new Error(e + ' Given value: "' + number + '"')
    }
  },
  async getContractNFTMeta(nftAddress, nftId, nftType) {
    console.log(loopringSDK)
    const res = await loopringSDK.getContractNFTMeta(
      web3,
      nftAddress,
      nftId,
      nftType
    )
    console.log(res)
    return res
  },
  testLoop: async (wal) => {
    const account = await axios.get(
      'https://api3.loopring.io/api/v3/account?owner=' + wal
    )
    console.log(account.data)
  },
  async getAccountApiKey(accountId, sig) {
    const url = LOOPRING_URL + '/apiKey?accountId=' + accountId
    console.log(accountId, sig)
    const resp = await axios.get(url, { params: { 'X-API-SIG': sig } })
    const apiKey = resp.data
    console.log(apiKey)
    return apiKey
  },
  async getAccountByWalletAddress(wallet) {
    //temp prev connection errors
    //temp handle ens
    console.log(wallet)
    if (!wallet || wallet.includes('.')) return null
    const accountUrl = LOOPRING_URL + '/account'
    try {
      const accountResult = await axios.get(accountUrl, {
        ...loopringOptions,
        params: { owner: wallet },
      })
      // const { accountId } = accountResult.data
      return accountResult.data || null
    } catch (e) {
      console.log(e.message || 'no message property')
      console.log(e)
    }
  },
  getUserNftBalancesLoopring: async (accountId) => {
    // https://api3.loopring.io/api/v3/account?owner=0x123456

    const balancesUrl = LOOPRING_URL + '/user/nft/balances'
    console.log(accountId)
    if (!accountId) return []

    try {
      const balanceResult = await axios.get(balancesUrl, {
        ...loopringOptions,
        params: { accountId: accountId },
      })
      return balanceResult.data.data
    } catch (e) {
      console.log(e.message || 'no message property')
      console.log(e)
    }
  },
  getUserNftBalancesMoralis: async (walletAddress) => {
    if (!walletAddress) return null
    const url = `${MORALIS_URL}/${walletAddress}/nft?chain=eth&format=decimal`
    const res = await axios.get(url, moralisOptions)
    console.log(res)
  },
  getUserTrades: async () => {
    const url = LOOPRING_URL + '/user/balances'
    // const res = await axios.get(url, loopringOptions)
    console.log(LoopringAPI)
    const res = await LoopringAPI.exchangeAPI.getAllTickers()
    console.log(account)
    console.log(res)
  },
  getReddit: async (url) => {
    // const url =
    //   'https://api.reddit.com/r/GamestopNFTGames/comments/vg1tf7/its_time_for_another_nft_minigame_giveaway_drop/'
    const res = await axios.get(url)
    // console.log(res)
    return res.data
  },
  compare: async () => {
    //full thread
    const url1 =
      'https://api.reddit.com/r/GamestopNFTGames/comments/vg1tf7/its_time_for_another_nft_minigame_giveaway_drop/'
    //comment
    const url2 =
      'https://api.reddit.com/r/Superstonk/comments/viqrbm/gme_daily_directory_new_start_here_discussion/idfirjl/?utm_source=share&utm_medium=web2x&context=3'
    const res1 = await axios.get(url1)
    const res2 = await axios.get(url2)

    console.log('-------------')
    console.log(res1.data[1].data)
    console.log(res2.data[1].data)
  },
  test: async () => {
    //https://api.rarible.org/v0.1/items/byOwner/?owner=ETHEREUM:0xA62C40b4c3A08BA9da949398F3208DCD0922F215
    // const url = 'https://api.rarible.org/v0.1/items/byOwner/'
    const url = 'https://api.rarible.org/v0.1/activities/byUser/'
    const params = {
      // blockchains: [
      //   'ETHEREUM',
      //   'POLYGON',
      //   'FLOW',
      //   'TEZOS',
      //   'SOLANA',
      //   'IMMUTABLEX',
      // ],
      type: 'TRANSFER_TO',
      blockchains: 'ETHEREUM',
      user: 'ETHEREUM:0xA62C40b4c3A08BA9da949398F3208DCD0922F215',
    }
    const resp = await axios.get(url, { params })
    console.log(resp)
    return resp
  },
  async testSign(wallet) {
    /*
      working methods:
        eth_chainId
    */
    console.log('-----TESTING----')
    console.log(wallet)
    const ethereum = window.ethereum
    const acctResp = await api.getAccountByWalletAddress(wallet)
    console.log(acctResp)
    console.log(acctResp.accountId)
    if (acctResp.accountId) {
      console.log(acctResp.keySeed)
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [acctResp.keySeed, wallet],
      })
      const apiKey = await api.getAccountApiKey(acctResp.accountId)
    }

    //  const appKey = await ethereum.request({
    //    method: 'eth_chainId',
    //   })
    console.log('-----END TESTING----')
    return acctResp

    return
    const message = 'Hello from Ethereum Stack Exchange!'
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    const signature = await ethereum.request({
      method: 'personal_sign',
      params: [message, account],
    })
    // const signature = await ethereum.request({
    //   method: 'eth_sign',
    // })
    console.log(signature)
    return signature
  },
  signatureKeyPairMock: async (accInfo, _web3) => {
    // args
    // accInfo: sdk.AccountInfo,
    // _web3: Web3 = web3
    const eddsaKey = await sdk.generateKeyPair({
      web3: _web3,
      address: accInfo.owner,
      keySeed:
        accInfo.keySeed ??
        sdk.GlobalAPI.KEY_MESSAGE.replace(
          '${exchangeAddress}',
          LOOPRING_EXPORTED_ACCOUNT.exchangeAddress
        ).replace('${nonce}', (accInfo.nonce - 1).toString()),
      walletType: sdk.ConnectorNames.MetaMask,
      chainId: sdk.ChainId.GOERLI,
    })
    return eddsaKey
  },
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
    const ethereum = window.ethereum
    if (!ethereum) {
      return false
    }
    // if (!ethereum.connected) {
    try {
      console.log('ytryyy')
      console.log(ethereum.connected)
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      }) // <<< ask for permission

      console.log('connected')
      ethereum.on('disconnect', (message) =>
        console.log('WALLET DIS:' + message)
      )
      ethereum.on('message', (message) =>
        console.log('WALLET EVENT:' + message)
      )
      console.log(ethereum)
      console.log(accounts)
      return accounts[0] //always returns responding wallet
    } catch (e) {
      console.error('error connecting wallet')
      return e
    }
    // }
    console.log('wallet already connected')
    return ethereum.currentAddress
  },
  async isConnected() {
    if (!window?.ethereum?.connected) return false
    const ethereum = window.ethereum
    const accounts = await ethereum.request({
      method: 'eth_accounts',
    })
    return accounts.length > 0
  },
}
