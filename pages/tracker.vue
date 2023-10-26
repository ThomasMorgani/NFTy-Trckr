<script>
import api from '~/services/loopring.js'

import { mapState } from 'vuex'
export default {
  name: 'tracker',
  data: () => ({
    error: null,
    permalink: null,
  }),
  computed: {
    ...mapState({
      comments: (state) => state.comments,
    }),
    commentsDisplayed() {
      if (!this.comments) return null
      console.log(this.comments)
      const commentsDisplayed = this.comments.map((c) => {
        const {
          author,
          created,
          created_utc,
          id,
          body,
          body_html,
          permalink,
          replies,
        } = c.data
        const comment = {
          author,
          authorProfile: REDDIT_BASE_URL + '/user/' + author,
          created,
          created_utc,
          id,
          body,
          body_html,
          parsedWallet: c.parsedWallet,
          nftyBalances: c.nftyBalances,
          permalink: REDDIT_BASE_URL + '/' + permalink || '',
          replies,
          repliesCount: replies?.data?.children?.length || 0,
        }
        return comment
      })

      if (this.filters.noReplies) {
        return commentsDisplayed.filter((c) => c.repliesCount < 1)
      }

      return commentsDisplayed
    },
  },
  methods: {
    async testApi() {
      await loopring.test()
    },
    async fetchApi(url) {
      if (!url || !url.includes('reddit.com')) {
        this.error = 'Please enter a valid reddit link'
        return
      }
      // testing thread or comment
      // loopring.compare()
      // return ''

      // url = this.fixUrl(
      //   'https://loopring.reddit.com/r/Superstonk/comments/viqrbm/gme_daily_directory_new_start_here_discussion/idfirjl/?utm_source=share&utm_medium=web2x&context=3'
      // )
      url = this.fixUrl(this.permalink)
      // const comments = await this.parseData(mockData)
      const res = await loopring.getReddit(url)
      const comments = await this.parseData(res)

      const balances = []
      for (let comment of comments) {
        console.log(comment)
        comment.parsedWallet = this.findEthAddress(comment.data.body)
        const balance = await this.getWalletBalance(comment.parsedWallet)
        console.log('balance------')
        console.log(balance)
        const nftyBalances = this.nftyArcades
          .sort((a, b) => a.name.localeCompare(b.name))

          .map((nftyNft) => {
            const nftyBalance = balance.find((tx) => tx.nftId === nftyNft.nftId)
            return { nftId: nftyNft.nftId, total: nftyBalance?.total || 0 }
          })
        comment.nftyBalances = nftyBalances
      }
      this.comments = comments
    },
    fixUrl(url) {
      console.log(url.split('?'))
      if (typeof url !== 'string') return null
      return (
        url.split('?')[0].replace('www.reddit.com', 'loopring.reddit.com') ||
        null
      )
    },
    findEthAddress(str) {
      // console.log(str)
      if (!str) return null
      let resp = str.match(/0x[a-fA-F0-9]{40}/)
      // console.log(resp)
      if (!resp?.[0]) {
        //sill check for ens.
        //to. use better detection, lookup found address for wallet
        resp = str.split(' ').filter((str) => str.includes('.eth'))
      }
      return resp?.[0]?.trim() || null
    },
    async getWalletBalance(wallet) {
      console.log('wallet=====')
      console.log(wallet)
      return await loopring.getAccountNftBalancesLoopring(wallet)
    },
    async parseData(resp) {
      console.log(resp)
      const permalinkFixed = this.permalink.split('?')[0]
      console.log(permalinkFixed)
      //full thread or comment else []
      // let rootComment = resp?.[1]?.data?.children?.[0] || null
      let rootComment = resp?.[1]?.data?.children || null
      console.log(rootComment)
      const rootCommentPermalink =
        this.redditBaseUrl + rootComment?.[0]?.data?.permalink || ''
      console.log(permalinkFixed)
      console.log(rootCommentPermalink)
      console.log(permalinkFixed === rootCommentPermalink)
      if (!rootComment) return rootComment

      // permalinkFixed === rootCommentPermalink
      const comments = permalinkFixed.includes('/comment/')
        ? rootComment[0].data.replies.data.children
        : rootComment
      // : rootComment.data.children
      // const comments =
      //   rootComment?.children || rootComment?.replies?.data?.children || []
      console.log(comments)
      // return
      // this.comments = [...comments]
      return comments
    },

    validateUrl(url) {
      return true
    },
  },
}
</script>

<template>
  <section>
    <section class="section">
      <form action="#" @submit.prevent="fetchApi(permalink)" class="full-width">
        <div class="nes-field">
          <label for="endpoint">Root permalink</label>

          <div class="flex-row">
            <input
              v-model="permalink"
              type="text"
              id="endpoint"
              class="nes-input is-dark permalink-input"
            />
            <button type="submit" class="nes-btn is-primary mx">START</button>
          </div>
        </div>
      </form>

      <button type="button" @click="testApi()" class="nes-btn is-error mx">
        test
      </button>
    </section>
    <section class="section results-section">
      <article class="nes-container is-rounded with-title full-width">
        <p class="title">RESULTS</p>
        <p v-if="comments === null && !error">
          Enter and submit a comment or thread url to start.
        </p>
        <p v-else-if="error" class="nes-text is-error">
          <img
            class="nes-avatar"
            alt="Gravatar image example"
            src="/bowser-icon.png"
            style="image-rendering: pixelated"
          />
          {{ error }}
        </p>
      </article>
    </section>

    <section class="section">
      <p v-if="comments === []">No comments</p>

      <div v-else class="comments-section">
        <comment-card
          v-for="(comment, idx) in commentsDisplayed"
          :key="idx"
          :comment="comment"
          :nftyArcadesById="nftyArcadesById"
        ></comment-card>
      </div>

      <p></p>
    </section>
  </section>
</template>

<style lang="css" scoped>
.permalink-input {
  flex-grow: 1;
}
</style>
