import web3 from 'web3'
import axios from '@/services/api'
import { LoopringAPIClass, generateKeyPair } from './loopring-sdk'

//this defunct?
// const LOOPRING_PINATA_URL = 'https://loopring.mypinata.cloud/ipfs'
const LOOPRING_PINATA_URL = 'https://www.gstop-content.com/ipfs/'
const LOOPRING_URL = 'https://api3.loopring.io/api/v3'

const loopringOptions = (address) => {
  const { apiKeys } = window?.$nuxt?.$store?.state || {}
  const loopringApi = apiKeys?.loopring || {}
  const key = loopringApi?.[address] || Object.values(loopringApi)[0] || null
  const options = {
    headers: {
      Accept: 'text/plain',
      common: {
        Accept: 'text/plain',
        'X-API-KEY': key,
      },
    },
  }
  return options
}

const LoopringAPI = new LoopringAPIClass()
const w3 = new web3(window.gamestop)

export default {
  async getApiKey(walletAddress, account) {
    if (!account?.accountId) {
      console.log('throw error no connected wallet')
      return
    }
    const { accountId, keySeed, owner } = account
    try {
      const kp = await generateKeyPair({
        web3: w3,
        address: owner,
        accountId,
        keySeed,
      })
      const { apiKey } = await LoopringAPI.userAPI.getUserApiKey(
        {
          accountId,
        },
        kp.sk
      )
      return apiKey
    } catch (e) {
      console.log('error getting api key')
      console.log(e.message)
      throw e
    }
  },

  async getAccountApiKey(accountId, sig) {
    const url = LOOPRING_URL + '/apiKey?accountId=' + accountId
    const resp = await axios.get(url, { headers: { 'X-API-SIG': sig } })
    const apiKey = resp.data
    return apiKey
  },
  async getAccountByWalletAddress(wallet) {
    //temp prev connection errors
    //temp handle ens
    if (!wallet || wallet.includes('.')) return null
    const accountUrl = LOOPRING_URL + '/account'
    try {
      const accountResult = await axios.get(accountUrl, {
        ...loopringOptions(),
        params: { owner: wallet },
      })
      // const { accountId } = accountResult.data
      return accountResult.data || null
    } catch (e) {
      console.log(e)
      const resp = {
        error: true,
        message: 'error retrieving account.',
      }

      // reserve for other scenarios
      if (e?.data?.resultInfo?.message) {
        resp.message = e?.data?.resultInfo?.message
      }
      return resp
    }
  },
  async getAccountInfo(accountId = null, walletAddress = null) {
    const url = LOOPRING_URL + '/account'
    const params = {}
    if (accountId !== null) params.accountId = accountId
    if (walletAddress !== null) params.owner = walletAddress
    try {
      const resp = await axios.get(url, { params })
      return resp.data || null
    } catch (e) {
      throw e
      return e.response.data
    }
  },
  async getAccountNftBalancesLoopring(accountId, metadata = true) {
    if (!accountId) return []
    const balancesUrl = LOOPRING_URL + '/user/nft/balances'
    const loopOpts = loopringOptions()
    if (!loopOpts?.headers?.common?.['X-API-KEY']) {
      throw Error('API KEY REQUIRED')
    }
    try {
      let balances = []
      let limit = 50 //seems to be most api will return per request
      let offset = 0
      const initialResult = await axios.get(balancesUrl, {
        ...loopOpts,
        params: {
          accountId,
          metadata,
          minter: true,
          nftdata: true,
          nft: true,
          nftminter: true,
          limit,
          offset,
        },
      })
      let totalRemain = initialResult.data.totalNum || 0
      balances = [...initialResult.data.data]
      totalRemain -= initialResult.data.data.length
      while (totalRemain > 0) {
        offset += totalRemain >= limit ? limit : totalRemain
        const resp = await axios.get(balancesUrl, {
          ...loopringOptions(),
          params: { accountId, metadata, limit, offset },
        })
        balances = [...balances, ...resp.data.data]
        totalRemain -= offset
      }
      return balances
    } catch (e) {
      console.log(e.message || 'no message property')
      console.log(e)
    }
  },
  async getAccountTokenBalancesLoopring(accountId) {
    if (!accountId) return []
    const balancesUrl = LOOPRING_URL + '/user/balances'
    const loopOpts = loopringOptions()
    if (!loopOpts?.headers?.common?.['X-API-KEY']) {
      throw Error('API KEY REQUIRED')
    }
    try {
      const initialResult = await axios.get(balancesUrl, {
        ...loopOpts,
        params: {
          accountId,
        },
      })
      return initialResult.data
    } catch (e) {
      console.log('error in getUserTokenBalances')
    }
  },
  async getIpfsCIDfromnftId(nftId) {
    if (!nftId) return null
    const ipfs = await LoopringAPI.nftAPI.ipfsNftIDToCid(nftId)
    return ipfs
  },
  async getNftDatas(minter, tokenAddress, nftId, withMetaData = true) {
    const url = LOOPRING_URL + '/nft/info/nftData'
    const params = {
      minter,
      tokenAddress,
      nftId,
      metadata: withMetaData, //api does not seem to respect option,
    }
    //TODO: ERROR HANDLE
    const { data } = await axios.get(url, { ...loopringOptions(), params })
    return data
  },
  async getNftHolders(nftData, offset = 0, limit = 20) {
    if (typeof nftData !== 'string') return []
    const url = LOOPRING_URL + '/nft/info/nftHolders'
    const params = { nftData, limit, offset }
    // const params = { nftData, limit: 500 }
    const resp = await axios.get(url, { ...loopringOptions(), params })
    console.log(resp)
    return resp.data
  },
  async getNftInfoByNftData(
    nftDatas = '',
    withMetaData = true,
    withIpfsData = true
  ) {
    if (!nftDatas) return null
    const url = LOOPRING_URL + '/nft/info/nfts'
    const params = { nftDatas, metadata: withMetaData }
    const resp = await axios.get(url, { ...loopringOptions(), params })
    const nftInfo = resp.data[0]
    if (withIpfsData && nftInfo.nftId) {
      const cifs = await this.getNftIpfsMetaDataByNftId(nftInfo.nftId)
      nftInfo.metadata = cifs
    }
    ///PICK UP HERE
    /// CREATE UITIL TO getNftContentMeta
    /// Create function go through possible urls, fetch, grab header content type
    // model, video, image, html
    // https://github.com/fudgebucket27/Lexplorer/search?q=contentType

    return nftInfo
  },
  async getNftIpfsMetaDataByCid(cid) {
    const resp = await axios.get(LOOPRING_PINATA_URL + cid, {
      headers: {
        Accept: 'text/plain',
      },
    })
    return resp.data
  },
  async getNftIpfsMetaDataByNftId(nftId) {
    const CID = await this.getIpfsCIDfromnftId(nftId)
    const metadata = await this.getNftIpfsMetaDataByCid(CID)
    return metadata
  },

  async getNftTokenAddress({ nftFactory, nftOwner, nftBaseUri }) {
    const url = LOOPRING_URL + '/nft/info/computeTokenAddress'
    const params = {
      nftFactory,
      nftOwner,
      nftBaseUri,
    }
    const address = await axios.get(url, { params })
    return address.data
  },
  async getTokenAmmPairings() {
    const tokenPairingsUrl = LOOPRING_URL + '/amm/balances'
    try {
      const initialResult = await axios.get(tokenPairingsUrl)
      //for now, only show USDC stable coin pairings
      // const pairings = marketData.filter(p => p.poolName.includes('USDC'))
      return initialResult.data
    } catch (e) {
      console.log('error in getUserTokenBalances')
    }
  },
  async getTokenInfo() {
    const tokenInfoUrl = LOOPRING_URL + '/exchange/tokens'
    try {
      const initialResult = await axios.get(tokenInfoUrl)
      const allTokens = initialResult?.data || []
      // not interested in liquid protocol
      const tokens = allTokens.filter((t) => !t.symbol.includes('LP-'))
      return tokens
    } catch (e) {
      console.log('error in getUserTokenBalances')
    }
  },
  async getTokenLatestPrices() {
    const tokenPricesUrl = LOOPRING_URL + '/datacenter/getLatestTokenPrices'
    try {
      const initialResult = await axios.get(tokenPricesUrl)
      if (initialResult?.data?.resultInfo?.message === 'SUCCESS') {
        return initialResult.data?.data || []
      } else {
        throw Error('did not receive message SUCCESS from request')
      }
    } catch (e) {
      console.log('error in getUserTokenBalances')
    }
  },
}
