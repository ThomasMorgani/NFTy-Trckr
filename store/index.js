import db from '@/services/db.js'
export const state = () => ({
  apiKeys: {
    loopring: {},
  },
  collectionFilters: {
    isDeployed: null,
    ownsNft: null,
    search: null,
  },
  collections: [],
  collectionSelectedData: {},
  collectionSelectedItems: [],
  collectionItemsData: [],
  comments: null,
  connectedAccount: null,
  connectedBalances: null,
  connectedWallet: null,
  contentLoading: false,
  filters: {
    search: null,
    sort: 'name_asc',
  },
  // filtersApplied: {
  //   hasNft: null,
  //   search: null,
  //   sort: null,
  // },
  isLoading: true,
  modal: false,
  modalData: null,
  redditBaseUrl: 'https://www.reddit.com',
  scrollElement: null,
  scrollElementPos: 0,
  snackbar: {
    text: 'Welcome!',
    show: null, //null so snackbar is hidden on load
  },
  subView: null,
  trackers: [],
  trackerFilters: {
    noReplies: false,
    noSent: false,
  },
  view: null,
  walletError: null,
})

export const actions = {
  async appInitialize({ commit }) {
    const [result, error] = await db.dbinit()
    if (error) {
      console.log('error initializing db...handle')
      console.log(error)
      //throw error
      // return false
    }
    commit('COMMIT_IS_LOADING', false)
    return result
  },

  setApiKeys({ commit }, keys) {
    commit('COMMIT_API_KEYS', keys)
    // db.write('collections', collections)
  },
  setCollectionItemsData({ commit }, data) {
    commit('COMMIT_COLLECTION_ITEMS_DATA', data)
    // db.write('collections', collections)
  },
  setCollections({ commit }, collections) {
    commit('COMMIT_COLLECTIONS', collections)
    // db.write('collections', collections)
  },
  setCollectionSelectedData({ commit }, data) {
    commit('COMMIT_COLLECTION_SELECTED_DATA', data)
  },
  setCollectionSelectedItems({ commit }, items) {
    commit('COMMIT_COLLECTION_SELECTED_ITEMS', items)
  },
  setCollectionsHeader({ commit }, data) {
    commit('COMMIT_COLLECTIONS_HEADER', data)
  },
  setConnectedAccount({ commit }, account) {
    commit('COMMIT_CONNECTED_ACCOUNT', account)
  },
  setConnectedBalances({ commit }, balances) {
    commit('COMMIT_CONNECTED_BALANCES', balances)
  },
  setConnectedWallet({ commit }, wallet) {
    commit('COMMIT_CONNECTED_WALLET', wallet)
  },
  setContentLoading({ commit }, isLoading) {
    commit('COMMIT_CONTENT_LOADING', isLoading)
  },
  setFilters({ commit }, filters) {
    commit('COMMIT_FILTERS', filters)
  },
  setModalData({ commit }, data) {
    commit('COMMIT_MODAL_DATA', data)
  },
  setScrollElement({ commit }, el) {
    commit('COMMIT_SCROLL_ELEMENT', el)
  },
  setScrollElementPos({ commit }, pos) {
    commit('COMMIT_SCROLL_ELEMENT_POS', pos)
  },
  setSnackbar({ commit }, data) {
    const timeout = 2500
    if (!data.show) {
      data.text = ''
      data.show = false
    }
    if (data.text || data.show) {
      data.show = true
      //pass current text to retain message on snackbar leave
      setTimeout(
        () => commit('COMMIT_SNACKBAR', { show: false, text: data.text }),
        timeout
      )
    }

    commit('COMMIT_SNACKBAR', data)
  },
  setSubView({ commit }, subView) {
    commit('COMMIT_SUB_VIEW', subView)
  },
  setView({ commit }, view) {
    commit('COMMIT_VIEW', view)
  },
  setWalletError({ commit }, errorObj) {
    commit('COMMIT_WALLET_ERROR', errorObj)
  },
  toggleModal({ commit, state }, value = null) {
    commit('COMMIT_MODAL', value === null ? !state.modal : value)
  },
}

export const mutations = {
  COMMIT_API_KEYS(state, keys = {}) {
    state.apiKeys = { ...keys }
  },
  COMMIT_CONNECTED_ACCOUNT(state, account = {}) {
    state.connectedAccount = { ...account }
  },
  COMMIT_CONNECTED_BALANCES(state, balances = []) {
    state.connectedBalances = [...balances]
  },
  COMMIT_CONNECTED_WALLET(state, wallet) {
    state.connectedWallet = wallet
  },
  COMMIT_COLLECTION_ITEMS_DATA(state, itemsData) {
    state.collectionItemsData = [...itemsData]
  },
  COMMIT_COLLECTIONS(state, collections) {
    state.collections = [...collections]
  },

  COMMIT_COLLECTION_SELECTED_DATA(state, data) {
    state.collectionSelectedData = { ...data }
  },
  COMMIT_COLLECTION_SELECTED_ITEMS(state, data) {
    state.collectionSelectedItems = [...data]
  },
  COMMIT_COLLECTIONS_HEADER(state, data) {
    state.collectionsHeader = { ...data }
  },
  COMMIT_CONTENT_LOADING(state, isLoading) {
    state.contentLoading = isLoading
  },
  COMMIT_IS_LOADING(state, value) {
    state.isLoading = value
  },
  COMMIT_FILTERS(state, filters) {
    state.filters = filters
  },
  COMMIT_MODAL(state, value) {
    state.modal = value
  },
  COMMIT_MODAL_DATA(state, data) {
    state.modalData = data
  },
  COMMIT_SCROLL_ELEMENT(state, el) {
    state.scrollElement = el
  },
  COMMIT_SCROLL_ELEMENT_POS(state, scrollPos) {
    state.scrollElementPos = scrollPos
  },
  COMMIT_SNACKBAR(state, data) {
    state.snackbar = data
  },
  COMMIT_SUB_VIEW(state, subView) {
    state.subView = subView
  },
  COMMIT_VIEW(state, view) {
    state.view = view
  },
  COMMIT_TRACKERS(state, trackers) {
    state.trackers = trackers
  },
  COMMIT_WALLET_ERROR(state, errorObj) {
    state.walletError = { ...errorObj }
  },
}
