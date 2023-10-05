export default {
  getReddit: async (url) => {
    // const url =
    //   'https://api.reddit.com/r/GamestopNFTGames/comments/vg1tf7/its_time_for_another_nft_minigame_giveaway_drop/'
    const res = await axios.get(url)
    // console.log(res)
    return res.data
  },
}
