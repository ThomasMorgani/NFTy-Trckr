<script>
// import ErrorMessage from '~/components/error-message.vue'
import Loader from '@/components/loader.vue'
// import Modal from '@/components/modal.vue'
import loopring from '@/services/loopring.js'

export default {
  name: 'markets-page',
  components: {
    // ErrorMessage,
    Loader,
    // Modal,
  },
  data: () => ({
    isLoading: true,
    prices: [],
    tableTop: 'unset',
  }),
  computed: {
    pricesDisplayed() {
      const { search, sortSelect } = this.$store.state.filters
      let prices = [...this.prices] || []
      if (search) {
        prices = [
          ...prices.filter((c) => {
            const searchable = {
              name: c.name,
              symbol: c.symbol,
            }
            const searchableString = Object.values(searchable).join('')
            return searchableString.toLowerCase().includes(search.toLowerCase())
          }),
        ]
      }

      if (sortSelect?.fn) {
        return sortSelect.fn([...prices])
      }
      return prices
      // return [...prices].sort((a, b) => b.updated_at - a.updated_at)
    },
  },
  methods: {
    onResize() {
      this.tableTop = this?.$refs?.marketContent?.offsetTop
        ? `${this.$refs.marketContent.offsetTop}px`
        : 'unset'
    },
  },
  async created() {
    //normalize token data with min req data and set to state
    //set method to get market price every minute
    //future feature, set update interval
    const tokens = await loopring.getTokenInfo()
    const latestPrices = await loopring.getTokenLatestPrices()
    if (tokens.length && latestPrices.length) {
      //refactor: reduce
      const tokenPrices = []
      latestPrices.forEach((priceData) => {
        // console.log(priceData)
        const { price } = priceData
        const tokenInfo = tokens.find((t) => t.address === priceData.token)
        if (tokenInfo) {
          const { address, name, symbol, tokenId, type } = tokenInfo
          const priceData = { address, name, price, symbol, tokenId, type }
          tokenPrices.push(priceData)
        }
      })
      this.prices = [...tokenPrices]
      this.isLoading = false
      this.onResize()
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<template>
  <section
    ref="marketContent"
    class="section collection-section flex-column flex-grow align-center"
  >
    <loader v-if="isLoading" class="loader" />
    <table v-else class="nes-table is-bordered is-dark">
      <thead :key="tableTop" :style="{ top: tableTop }">
        <tr class="nes-text is-primary">
          <th>SYMBOL</th>
          <th>NAME</th>
          <th>PRICE</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pricing in pricesDisplayed" :key="pricing.symbol">
          <td>{{ pricing.symbol }}</td>
          <td>{{ pricing.name || '-' }}</td>
          <td>${{ pricing.price }}</td>
          <!-- <td>{{`$${parseFloat(pricing.price).toFixed(4)}`}}</td> -->
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
table {
  /* table-layout: auto; */
  width: clamp(100px, 100%, 1200px);
}
thead {
  background-color: inherit;
  position: sticky;
  /* top: 280px; */
  z-index: 4;
}
th:nth-child(1),
td:nth-child(1) {
  border-right: none;
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
th:nth-child(2),
td:nth-child(2) {
  border-left: none;
  border-right: none;
}
th:nth-child(3),
td:nth-child(3) {
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
