const RARIBLE_URL = 'https://api.rarible.org/v0.1'

export default {
  getUserNftBalancesRarible: async (wallet) => {
    //https://api.rarible.org/v0.1/items/byOwner/?owner=ETHEREUM:0xA62C40b4c3A08BA9da949398F3208DCD0922F215
    // const url = 'https://api.rarible.org/v0.1/items/byOwner/'
    const url = RARIBLE_URL + '/activities/byUser/'
    const params = {
      blockchains: [
        'ETHEREUM',
        'POLYGON',
        'FLOW',
        'TEZOS',
        'SOLANA',
        'IMMUTABLEX',
      ],
      // blockchains: 'ETHEREUM',
      type: 'TRANSFER_TO', //TO DO, CHANGE THIS
      user: `ETHEREUM:${wallet}`,
    }
    const resp = await axios.get(url, { params })
    console.log(resp)
    return resp
  },
}
