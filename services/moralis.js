// import moralis from '../private/moralis.json'
const MORALIS_URL = 'https://deep-index.moralis.io/api/v2'

const moralisOptions = {
  headers: {
    common: {
      'X-API-KEY': moralis?.web3ApiKey || null,
    },
  },
}

export default {
  async getNftMetaDataByIdMoralis(nftId) {
    // nftId = '0xe021f036eb12ea0e2f099d9b72a5501edc79cc7f-0-0xe61286c57cefd61aa5752fb84ae251d54bab36fc-0x90e414e66ccbf567206ffef4c62bb2c95bfa8ae5f38ced79e6a47f2c4622cc11-10"'
    // nftId = '0x7de3085b3190b3a787822ee16f23be010f5f8686'
    // nftId = '0x90e414e66ccbf567206ffef4c62bb2c95bfa8ae5f38ced79e6a47f2c4622cc11'
    const url = MORALIS_URL + `/nft/${nftId}/1?chain=eth&format=decimal`
    // const url = MORALIS_URL + 'https://deep-index.moralis.io/api/v2/nft/0x7dE3085b3190B3a787822Ee16F23be010f5F8686/metadata?chain=eth'
    const resp = await axios.get(url, moralisOptions)
    console.log(resp)
    return resp.data
  },

  getUserNftBalancesMoralis: async (walletAddress) => {
    if (!walletAddress) return null
    const url = `${MORALIS_URL}/${walletAddress}/nft?chain=eth&format=decimal`
    const res = await axios.get(url, moralisOptions)
    console.log(res)
  },
}
