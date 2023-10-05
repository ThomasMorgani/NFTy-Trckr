import tempNfty from '../static/data/nfty_mappings.json'

export default {
  async getNftyGames() {
    const resp = await axios.get(
      'https://beyourownarcade.com/wp-json/wp/v2/posts',
      { params: { categories: [58], per_page: 99 } }
    )
    const posts = resp.data || []
    //TODO ONCE nftId IS INCORPORATED INTO NFTY ARCADE REMOVE FITLER, MAPPING
    const temp = posts
      .map((p) => ({
        date_gmt: p.date_gmt,
        excerpt: p.excerpt?.rendered || '',
        image: p?.yoast_head_json?.og_image?.[0]?.url || null,
        link: p.link,
        nftData: tempNfty[p.slug] || null,
        slug: p.slug,
        title: p?.title?.rendered || 'unknown title',
      }))
      .filter((p) => p.nftData !== null)
    return temp
  },
}
