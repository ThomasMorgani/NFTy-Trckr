import * as sdk from '@loopring-web/loopring-sdk'

export class LoopringAPIClass {
  constructor() {
    const config = {
      baseUrl: 'https://api.loopring.network',
      chainId: sdk.ChainId.MAINNET,
    }
    this.userAPI = new sdk.UserAPI(config)
    this.exchangeAPI = new sdk.ExchangeAPI(config)
    this.walletAPI = new sdk.WalletAPI(config)
    this.nftAPI = new sdk.NFTAPI(config)
  }
}

export const generateKeyPair = async ({
  web3,
  address,
  accountId,
  keySeed,
}) => {
  const eddsaKey = await sdk.generateKeyPair({
    web3,
    address,
    accountId,
    keySeed,
  })
  return eddsaKey
}
