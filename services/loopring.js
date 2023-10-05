import web3 from 'web3'
import axios from '@/services/api'

//this defunct?
// const LOOPRING_PINATA_URL = 'https://loopring.mypinata.cloud/ipfs'
const LOOPRING_PINATA_URL = 'https://www.gstop-content.com/ipfs/'
const LOOPRING_URL = 'https://api3.loopring.io/api/v3'
const loopringOptions = (address) => {
  console.log('loopringOptions')
  const { apiKeys } = window?.$nuxt?.$store?.state || {}
  const loopringApi = apiKeys?.loopring || {}
  const key = loopringApi?.[address] || Object.values(loopringApi)[0] || null
  const options = {
    headers: {
      Accept: 'text/plain',
      common: {
        Accept: 'text/plain',
        // 'X-API-KEY': account?.ApiKey || null,
        'X-API-KEY': key,
        // 'X-API-SIG': '',
      },
    },
  }
  console.log(options)
  return options
}

import { LoopringAPIClass, generateKeyPair } from './loopring-sdk'

const LoopringAPI = new LoopringAPIClass()
const w3 = new web3(window.gamestop)
export default {
  async getApiKey(walletAddress, account) {
    // console.log(sdk)
    // sdk.InitApi()
    // console.log(sdk.generateKeyPair)
    console.log(LoopringAPI)
    console.log(w3.eth)
    if (!account?.accountId) {
      console.log('throw error no connected wallet')
      return
    }
    const { accountId, keySeed, owner } = account

    console.log(w3, accountId, keySeed, owner)
    try {
      const kp = await generateKeyPair({
        web3: w3,
        address: owner,
        accountId,
        keySeed,
      })

      console.log(kp)
      const { apiKey } = await LoopringAPI.userAPI.getUserApiKey(
        {
          accountId,
        },
        kp.sk
      )
      console.log(apiKey)
      // const apikeytest = await api.getAccountApiKey(account.accountId, x.sk)
      // console.log(apikeytest)
      return apiKey
    } catch (e) {
      console.log('error getting api key')
      console.log(e)
      throw e
    }
  },

  logLoopSDK() {
    this.test()
  },
  async getAccountApiKey(accountId, sig) {
    const url = LOOPRING_URL + '/apiKey?accountId=' + accountId
    console.log(accountId, sig)
    const resp = await axios.get(url, { headers: { 'X-API-SIG': sig } })
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
  async getNftDatas(minter, tokenAddress, nftId, withMetaData = true) {
    const url = LOOPRING_URL + '/nft/info/nftData'
    const params = {
      minter,
      tokenAddress,
      nftId,
      metadata: withMetaData, //api does not seem to respect option,
      //response always includes
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
    console.log(resp)
    const nftInfo = resp.data[0]
    console.log('/nft/info/nfts - with meta')
    console.log(nftInfo)

    if (withIpfsData && nftInfo.nftId) {
      console.log('getNftIpfsMetaDataByNftId - with ipfs')
      const cifs = await this.getNftIpfsMetaDataByNftId(nftInfo.nftId)
      nftInfo.metadata = cifs
      console.log(nftInfo)
    }

    ///PICK UP HERE
    /// CREATE UITIL TO getNftContentMeta
    /// Create function go through possible urls, fetch, grab header content type
    // model, video, image, html
    // https://github.com/fudgebucket27/Lexplorer/search?q=contentType

    return nftInfo
  },
  // async getNftInfoByNftDatas(nftDatas) {
  //   console.log(nftDatas)
  //   if (!nftDatas) return []
  //   const nftInfoUrl = LOOPRING_URL + '/nft/info/nfts'
  //   console.log(nftInfoUrl)

  //   try {
  //     const nftInfoResult = await axios.get(nftInfoUrl, {
  //       ...loopringOptions(),
  //       params: { nftDatas },
  //     })
  //     console.log(nftInfoResult)
  //     const nft = nftInfoResult.data[0]
  //     const test = await utils.getContractNFTMeta(
  //       nft.nftAddress,
  //       nft.nftId,
  //       nft.nftType
  //     )
  //     return nftInfoResult.data
  //   } catch (e) {
  //     console.log(e.message || 'no message property')
  //     console.log(e)
  //   }
  // },
  async getNftIpfsMetaDataByCid(cid) {
    const resp = await axios.get(LOOPRING_PINATA_URL + cid, {
      headers: {
        Accept: 'text/plain',
      },
    })
    return resp.data
  },

  async getNftIpfsMetaDataByNftId(nftId) {
    console.log(nftId)
    const CID = await this.ipfsCIDfromnftId(nftId)
    const metadata = await this.getNftIpfsMetaDataByCid(CID)
    return metadata
  },

  async ipfsCIDfromnftId(nftId) {
    if (!nftId) return null
    console.log(LoopringAPI)
    const ipfs = await LoopringAPI.nftAPI.ipfsNftIDToCid(nftId)
    return ipfs
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
  async getUserNftBalancesLoopring(accountId, metadata = true) {
    console.log('getUserNftBalancesLoopring')
    console.log(accountId)
    if (!accountId) return []
    const balancesUrl = LOOPRING_URL + '/user/nft/balances'
    console.log(accountId)
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
        console.log(resp)
        balances = [...balances, ...resp.data.data]
        console.log(balances)
        console.log(totalRemain)
        totalRemain -= offset
        console.log(totalRemain)
      }
      return balances
      // console.log(balanceResult)
      // return balanceResult.data.data
    } catch (e) {
      console.log(e.message || 'no message property')
      console.log(e)
    }
  },
}
