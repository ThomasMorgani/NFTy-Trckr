<script>
import { mapGetters, mapState } from 'vuex'
//this defunct?
// const LOOPRING_PINATA_URL = 'https://loopring.mypinata.cloud/ipfs'
const LOOPRING_PINATA_URL = 'https://www.gstop-content.com/ipfs/'
import loopring from '@/services/loopring.js'
import db from '@/services/db.js'
import utils from '@/services/utils.js'
import axios from 'axios'
import { getNftData } from '@loopring-web/loopring-sdk'
export default {
  name: 'nft-mixin',
  computed: {
    ...mapState({
      collections: (state) => state.collections,
      connectedAccount: (state) => state.connectedAccount,
      connectedWallet: (state) => state.connectedWallet,
      filters: (state) => state.filters,
    }),
    nftsDisplayed() {
      //TODO: create method to filter items,
      //take array, searchables, search
      //TODO: create method sort
      //take array, key, direction
      const { search, sort } = this.filters
      console.log(search)
      console.log(sort)
      let items = this.collectionItemsData || []
      console.log(items)
      if (search) {
        items = [
          ...items.filter((i) => {
            const {
              accountId,
              nftId,
              tokenAddress,
              uri,
              nftData,
              nftType,
              tokenId,
            } = i || ''
            const { name, description } = i?.metadata || ''

            const searchables = {
              accountId,
              nftId,
              tokenAddress,
              uri,
              nftData,
              nftType,
              tokenId,
              name,
              description,
            }
            const searchableString = Object.values(searchables).join('')
            return searchableString.toLowerCase().includes(search.toLowerCase())
          }),
        ]
      }
      return items
    },
  },
  methods: {
    async addNftToCache(nft) {
      console.log('add to cache')
      console.log(nft)
      try {
        if (!nft?.id) {
          throw Error('did not receive NFT with valid id')
        }
        const nftId = nft.id
        const existingNFT = await db.get('nfts', nftId)
        if (!existingNFT) {
          db.add('nfts', nft, 'nftId')
        }
        await db.put('collection-items', {
          id: collectionId,
          items: collectionItems,
        })
      } catch (e) {
        console.log('error adding nft to local cache')
        console.log(e.message)
        return false
      }
      return true
    },
    async addNftToCollection(collectionId, nft) {
      console.log(nft)
      if (!nft?.id) {
        console.error('did not receive NFT with valid id')
        return false
      }
      const nftId = nft.id
      const isSelectedCollection =
        collectionId === this.collectionSelectedData?.id

      const collection = isSelectedCollection
        ? { ...this.collectionSelectedData }
        : await db.get('collections', collectionId)

      const existingItems = isSelectedCollection
        ? [...this.collectionSelectedItems]
        : this.getCollectionNFTs(nftId)

      const collectionItems = [...existingItems, nftId]

      collection.itemCount = collectionItems.length

      try {
        await this.addNftToCache(nft)
        await db.put('collections', collection)
        const collections = [
          ...this.collections.filter((c) => c.id !== collection.id),
          collection,
        ]
        this.$store.dispatch('setCollections', collections)

        if (isSelectedCollection) {
          this.$store.dispatch('setCollectionSelectedData', collection)
          this.$store.dispatch('setCollectionSelectedItems', collectionItems)
        }
      } catch (e) {
        console.log('error updating collection from addNftToCollection.... ')
        return false
      }
      return true
    },
    animation(nft) {
      const ipfs =
        nft?.metadata?.extra?.animationUrl || nft?.metadata?.animation_url || ''
      return this.imageSrc(ipfs)
    },
    description(nft) {
      return nft.metadata?.base?.description || nft?.metadata?.description
    },
    async getAccountNftBalances(
      accountId,
      network = 'loopring',
      metadata = true
    ) {
      if (!accountId) {
        console.error('no account ID received')
        return
      }
      let balances = []
      try {
        if (network === 'loopring') {
          balances = await loopring.getUserNftBalancesLoopring(
            accountId,
            metadata
          )
        }
        const balancesNorm = balances.map((nft) => this.normalizeNft(nft))
        return balancesNorm
      } catch (e) {
        console.log('error getAccountNftBalances')
        throw Error(e.message || 'Error getting Account NFT Balances')
      }
    },
    async getCacheNftData(nftId) {
      console.log(nftId)
      if (!nftId) return nftId
      if (Array.isArray(nftId)) {
        const items = []
        for (let item of nftId) {
          console.log(item)
          const itemData = await db.get('nfts', item)
          if (itemData?.nftId) {
            items.push(itemData)
          }
        }
        return items
      }
      const itemData = await db.get('nfts', nftId)
      return itemData
    },
    async getCollectionNFTs(collectionId) {
      const res = await db.get('collection-items', collectionId)
      return res?.items || []
    },
    async getNftMedia(nft) {
      const mediaData = {
        contentLength: 0,
        contentType: '',
        isIframe: false,
        isImg: false,
        isModel: false,
        isVideo: false,
        mediaSrc: '',
      }
      if (!nft) return mediaData

      if (nft.metadata) {
        const { animation, animation_url, image } = nft.metadata
        //Try animation url first
        mediaData.mediaSrc = animation
          ? animation
          : animation_url
          ? this.animationUrl(animation_url)
          : image || ''

        console.log('=====================')
        console.log(nft.metadata)
        console.log(mediaData.mediaSrc)

        const resp = await axios.head(mediaData.mediaSrc)
        console.log(resp)
        if (resp.headers) {
          mediaData.contentLength = resp?.headers?.['content-length'] || ''
          mediaData.contentType = resp?.headers?.['content-type'] || ''
          mediaData.xIpfsPath = resp?.headers?.['x-ipfs-path'] || ''
          mediaData.xIpfsRoots = resp?.headers?.['x-ipfs-roots'] || ''
        }
        if (
          mediaData.contentType.includes('html') ||
          mediaData.contentType.includes('text')
        ) {
          mediaData.isIframe = true
        }
        if (mediaData.contentType.includes('image')) {
          mediaData.isImage = true
        }
        if (mediaData.contentType.includes('video')) {
          mediaData.isVideo = true
        }
      }
      return mediaData
    },

    async getNftHolders(nftData, withAccountInfo = false) {
      // FUTURE: incorporate other chains
      const holders = await loopring.getNftHolders(nftData)
      console.log(holders)
      if (withAccountInfo && holders.nftHolders) {
        for (let key in holders.nftHolders) {
          console.log(key)
          console.log(holders.nftHolders[key])

          const accountInfo = await loopring.getAccountInfo(
            holders.nftHolders[key].accountId
          )
          //For now just pulling out wallet
          holders.nftHolders[key].owner = accountInfo.owner
        }
      }
      return holders
    },
    image(nft) {
      return nft?.metadata?.imageSize
        ? Object.values(nft.metadata.imageSize)[0]
        : nft?.metadata?.image
        ? this.imageSrc(nft.metadata.image)
        : ''
    },

    imageSrc(ipfs) {
      //FUTURE: incorporate other chains
      // console.log(ipfs)
      return ipfs ? ipfs.replace('ipfs://', LOOPRING_PINATA_URL) : ''
      // : '/question-mark-block.png'
    },
    name(nft) {
      return nft?.metadata?.base?.name || nft?.metadata?.name || ''
    },
    normalizeNft(nft = {}) {
      //hasOwnProperty('color')
      const nftKeys = [
        'createdAt',
        // 'created_at',
        'creatorFeeBips',
        'minter',
        'nftBaseUri',
        'nftData',
        'nftFactory',
        'nftId',
        'nftType',
        'originalMinter',
        'originalRoyaltyPercentage',
        'nftOwner',
        'royaltyAddress',
        'royaltyPercentage',
        'status',
        'tokenAddress',
      ]
      const metadataKeys = ['animation', 'description', 'image', 'name']
      // const nftNormalized = { created_at_human: null, metadata: {} }
      const nftNormalized = { createdAtHuman: null, metadata: {} }

      nftKeys.forEach(
        (k) => (nftNormalized[k] = nft.hasOwnProperty(k) ? nft[k] : null)
      )

      if (nftNormalized?.nftId) nftNormalized.id = nftNormalized.nftId

      //TODO: handle possible props: base, extra, ??
      const metadata = nft?.metadata || {}
      const metadataBase = nft?.metadata?.base || {}
      const metadataExtra = nft?.metadata?.extra || {}
      nftNormalized.metadata = {
        ...metadata,
        ...metadataBase,
        ...metadataExtra,
      }
      // console.log(nftNormalized)

      metadataKeys.forEach((k) => (nftNormalized.metadata[k] = this[k](nft)))
      if (nft?.metadata?.imageSize)
        nftNormalized.metadata.imageSize = nft.metadata.imageSize

      // if (nft?.metadata?.extra)
      //   nftNormalized.metadata.extra = nft.metadata.extra

      if (nftNormalized.createdAt)
        nftNormalized.createdAtHuman = utils.epochToHuman(
          nftNormalized.createdAt
        )
      return nftNormalized
    },
    removeNftFromCollection(collectionId, nftId) {
      return new Promise(async (res, rej) => {
        const isSelectedCollection =
          collectionId === this.collectionSelectedData?.id

        const collection = isSelectedCollection
          ? { ...this.collectionSelectedData }
          : await db.get('collections', collectionId)

        const existingItems = isSelectedCollection
          ? [...this.collectionSelectedItems]
          : this.getCollectionNFTs(nftId)

        const collectionItems = [...existingItems.filter((i) => i.id !== nftId)]
        collection.itemCount = collectionItems.length

        try {
          await db.put('collection-items', {
            id: collectionId,
            items: collectionItems,
          })
          await db.put('collections', collection)
          const collections = [
            ...this.collections.filter((c) => c.id !== collection.id),
            collection,
          ]
          this.$store.dispatch('setCollections', collections)

          if (isSelectedCollection) {
            this.$store.dispatch('setCollectionSelectedData', collection)
            this.$store.dispatch('setCollectionSelectedItems', collectionItems)
          }
          res()
        } catch (e) {
          console.log('error updating collection from addNftToCollection.... ')
          console.log(e)
          rej(e.message)
        }
      })
    },
    async syncCollectionWalletItems(collection) {
      console.log(collection)
      // return
      let balances = []
      try {
        const account =
          this.connectedWallet === collection?.wallet?.address
            ? this.connectedAccount
            : await loopring.getAccountInfo(null, collection.address)
        //get balances of network (only loopring now)
        console.log(account)
        // return
        balances = await this.getAccountNftBalances(account.accountId)
        // console.log(balances)
        if (balances.length < 1) return balances
      } catch (e) {
        console.error('error getting wallet account')
        throw Error(e.message || 'error getting wallet account')
      }
      const balancesNormalized = []
      for (let nft of balances) {
        try {
          const nftWithMeta = await loopring.getNftInfoByNftData(nft.nftData)
          const nftNormalized = this.normalizeNft(nftWithMeta)
          balancesNormalized.push(nftNormalized)
          await this.addNftToCollection(collection.id, nftNormalized)
        } catch (e) {
          console.error('error getting NFT DATA for:')
          console.log(nft)
          // throw Error(e.message || 'Error syncing collectioon Wallet items')
        }
      }
      return balancesNormalized
    },
  },
}
</script>
