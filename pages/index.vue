<script>
import 'nes.css/css/nes.min.css'
import mockData from '@/static/mock_comment.json'

import CommentCard from '@/components/comment-card.vue'
export default {
  name: 'NiftyRedditTracker',
  components: {
    CommentCard,
  },
  data: () => ({
    comments: null,
    permalink: null,
  }),
  methods: {
    async fetchApi(url) {
      url = this.fixUrl(
        'https://api.reddit.com/r/Superstonk/comments/viqrbm/gme_daily_directory_new_start_here_discussion/idfirjl/?utm_source=share&utm_medium=web2x&context=3'
      )
      console.log('fetch disabled for dev')
      this.comments = this.parseData(mockData)

      // const resp = await this.$axios.$get(url)
    },
    fixUrl(url) {
      //replace www.reddit.com with api.reddit.com
      return url
    },
    parseData(resp) {
      const rootComment = resp?.[1]?.data?.children?.[0]?.data || null
      if (!rootComment) return rootComment
      const comments = rootComment?.replies?.data?.children || []
      this.comments = [...comments]
      console.log(comments)
      return comments
    },
    validateUrl(url) {
      return true
    },
  },
}
</script>

<template>
  <main>
    <header>
      <i class="nes-icon reddit is-large"></i>

      <h1 class="title">NiFTy reddit tracker</h1>
    </header>

    <section class="section">
      <form action="#" @submit.prevent="fetchApi(permalink)">
        <div class="nes-field">
          <label for="endpoint">Root endpoint</label>

          <div class="flex-row">
            <input
              v-model="permalink"
              type="text"
              id="endpoint"
              class="nes-input is-dark"
            />
            <button type="submit" class="nes-btn is-primary mx">START</button>
          </div>
        </div>
      </form>
    </section>

    <section class="section">
      <p v-if="comments === null">Submit for replies</p>

      <p v-else-if="comments === []">No comments</p>

      <div v-else>
        <comment-card
          v-for="(comment, idx) in comments"
          :key="idx"
          :comment="comment"
          >{{ idx }}</comment-card
        >
      </div>

      <p></p>
    </section>
  </main>
</template>

<style>
:root {
  --base-padding: 2rem;
  --background-color: #212529;
  --primary-color: #fff;
}

body {
  background-color: var(--background-color);
  color: var(--primary-color);
  height: 100vh;
}

main {
  padding: var(--base-padding);
}

header {
  display: flex;
  align-items: center;
}

.flex-row {
  display: flex;
  align-items: center;
}

.mx {
  margin-inline: 2rem;
}

.title {
  margin-left: var(--base-padding);
}

.section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--base-padding);
}
</style>
