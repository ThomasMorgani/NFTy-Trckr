import etherscan from '../private/etherscan.json'
const etherscanOptions = {
  params: {
    apikey: etherscan.apikey || null,
  },
}
