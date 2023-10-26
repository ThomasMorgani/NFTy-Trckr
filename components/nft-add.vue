<script>
import { mapState } from 'vuex'
import ErrorMessage from '@/components/error-message.vue'
import Modal from '@/components/modal.vue'
import NftPreview from '@/components/nft-preview.vue'

import db from '@/services/db.js'
import loopring from '@/services/loopring'
import utils from '@/services/utils'
import collectionMixin from '~/mixins/collection-mixin.vue'
import nftMixin from '~/mixins/nft-mixin.vue'
export default {
  name: 'nft-add',
  components: {
    ErrorMessage,
    Modal,
    NftPreview,
  },
  mixins: [collectionMixin, nftMixin],
  data: () => ({
    errorsChecked: [],
    formErrors: [],
    // isSearching: false,
    isSubmitting: false,
    modalConfirmAdd: false,
    networkSelect: 'loopring',
    nftId: '0xa495a52715bad5bba1bcfe4bf3a329ac0203802c0c499a2c0a63670d1a0eb4f4',
    nftIdsFailed: [],
    minter: '0xe021f036eb12ea0e2f099d9b72a5501edc79cc7f',
    nft: {},
    tokenAddress: '0xe61286c57cefd61aa5752fb84ae251d54bab36fc',
    // errorsChecked: ['badInput', 'patternMismatch', 'tooLong', 'valueMissing'],
    // errorsMap: {
    //   // badInput: {
    //   //   nameInput: 'Name field bad input.',
    //   //   nftIdInput: 'nftId field bad input.',
    //   // },
    //   // patternMismatch: {
    //   //   nameInput: 'Name can have alphanumeric characters only.',
    //   //   nftIdInput: 'nftId pattern error.',
    //   // },
    //   // tooLong: {
    //   //   nameInput: 'Name can be a maximum of 80 characters.',
    //   //   nftIdInput: 'nftId can be a maximum of 80 characters.',
    //   // },
    //   valueMissing: {
    //     nftIdInput: 'Wallet nftId cannot be blank.',
    //   },
    // },
  }),
  computed: {
    ...mapState({
      connectedAccount: (state) => state.connectedAccount,
      modalData: (state) => state.modalData,
    }),
    addBtnText() {
      if (!this.nftId || !this.minter || !this.tokenAddress) {
        return 'All fields are required.'
      }

      if (this.nftIdsFailed.includes(this.nft.nftId)) {
        return 'Known bad nftId.'
      }

      if (
        this.nftId &&
        this.collectionSelectedData &&
        this.collectionSelectedItems?.includes(this.nftId)
      ) {
        return 'Nft already belongs to this collection.'
      }

      return ''
    },
    nfts() {
      return this.$store.state.nfts
    },
    // isReadonly() {
    //   return this.nft.id === 'nfty'
    // },
  },
  methods: {
    inputIsValid(e) {
      //if not yet mounted, do not "pre" invalidate
      if (!e?.validity) return true
      return e?.validity?.valid
    },
    modalConfirmAddToggle() {
      if (this.modalConfirmAdd) {
        this.isSubmitting = false
        this.nft.nftId = null
      }
      this.modalConfirmAdd = !this.modalConfirmAdd
    },
    // async onSearch() {
    //   // if(this.isSearching) return
    //   if (!this.nftId) {
    //     this.formErrors = ['Please enter a valid NFT ID.']
    //     return
    //   }
    //   console.log(this.connectedAccount)
    //   // if (!this?.connectedAccount?.apiKey) {
    //   //   const test = await loopring.getApiKey(this.connectedAccount)
    //   //   console.log(test)
    //   // }
    //   this.isSearching = true
    //   try {
    //     if (this.nftIdsFailed.includes(this.nftId)) throw Error('knowninvalid')
    //     const res = await loopring.getNftMetaDataBynftId(this.nftId)
    //     console.log(res)
    //     if (res?.name) {
    //       this.nft = { ...res }
    //       // this.$store.dispatch('setModalData', res)
    //       // this.$store.dispatch('toggleModal', true)
    //     }
    //   } catch (e) {
    //     console.log(e)
    //     this.formErrors = ['Unable to find any NFT with the provided ID.']
    //     if (e.message !== 'knowninvalid') {
    //       this.nftIdsFailed = [...this.nftIdsFailed, this.nftId]
    //     }
    //   }
    //   this.isSearching = false
    // },
    async onSubmit() {
      console.log('onSubmit')
      if (this.modalConfirmAdd && this.nft.nftId) {
        console.log('submit addition')
        if (this.collectionSelectedData.id === 'cached') {
          const cachedNft = await this.addNftToCache(this.nft)
          this.$store.dispatch('setCollectionSelectedData', {
            ...this.collectionSelectedData,
            updated_at: new Date().getTime(),
          })
          this.$store.dispatch('setCollectionSelectedItems', [
            ...this.collectionSelectedItems,
            cachedNft.nftId,
          ])
          this.$store.dispatch('setCollectionItemsData', [
            ...this.collectionItemsData,
            cachedNft,
          ])
        } else {
          this.addNftToCollection(this.collectionSelectedData.id, this.nft)
        }
        this.$store.dispatch('setSnackbar', {
          show: true,
          text: `Nft added!`,
        })
        this.isSubmitting = false
        this.$store.dispatch('toggleModal', false)
        return
      }

      if (this.isSubmitting) return
      if (this.addBtnText) {
        this.formErrors = [this.addBtnText]
        return
      }

      // TODO: use method for all of this should exist in mixin..
      this.isSubmitting = true
      let newNFT = await db.get('nfts', this.nftId)
      if (!newNFT) {
        try {
          const nftDatas = await loopring.getNftDatas(
            this.minter,
            this.tokenAddress,
            this.nftId,
            false
          )
          console.log(nftDatas)
          if (nftDatas) {
            const nftInfo = await loopring.getNftInfoByNftData(
              nftDatas?.nftData
            )
            newNFT = this.normalizeNft(nftInfo)
            newNFT.media_meta = await this.getNftMedia(newNFT)
            //
            //
            // db.add('nfts', newNFT, 'nftId')
          }
        } catch (e) {
          console.log(e)
          this.formErrors = [e.message]
          return
        }
      }

      this.nft = { ...newNFT }
      this.modalConfirmAddToggle()
      return
    },
    async validateForm() {
      console.log('TODO: VALIDATE NFT ADD FORM')
      return true
    },
  },
  created() {},
}
</script>
<template>
  <modal
    :isOpen="$store.state.modal === 'nft-add'"
    :styleOverride="{ 'min-height': '80vh' }"
  >
    <modal
      :closeEvent="modalConfirmAddToggle"
      :isOpen="modalConfirmAdd"
      :overlayEvent="modalConfirmAddToggle"
    >
      <div class="flex-column full-height content-between">
        <h2 class="title nes-text is-warning mb">CONFIRM ADD</h2>
        <section class="results-section my">
          <NftPreview v-if="nft?.nftId" :nft="nft" />
        </section>
        <button
          text="Add collection"
          @click.prevent="onSubmit"
          class="nes-btn is-success full-width mt"
        >
          ADD
        </button>
      </div>
    </modal>
    <h2 class="title nes-text is-primary pb">ADD NFT</h2>
    <div class="full-width pb">
      <label for="network-select">Network</label>
      <div class="nes-select">
        <select v-model="networkSelect" disabled id="network-select" required>
          <!-- <option
            v-for="option in sortSelectOptions"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled === true"
            :selected="option.value === sortSelect"
            :hidden="option.hidden"
          >
            {{ option.text }}
          </option> -->
          <option value="loopring">loopring</option>
        </select>
      </div>
    </div>
    <form
      ref="form"
      @submit.prevent="onSubmit"
      novalidate="true"
      class="form-section flex-column full-width flex-grow full-height"
      @click.stop=""
    >
      <div class="nes-field full-width pb">
        <label for="name">NFT ID</label>
        <!-- <div class="flex-row content-between align-center align-end"> -->
        <textarea
          v-model="nftId"
          autofocus
          id="nftId"
          no-resize
          ref="idInput"
          required
          rows="2"
          type="text"
          class="nes-input is-dark"
        />

        <!-- </div> -->
      </div>

      <div class="nes-field full-width pb">
        <label for="minter-address">Minter</label>
        <input
          v-model="minter"
          id="minter-address"
          ref="minterInput"
          required
          type="text"
          class="nes-input is-dark"
          :class="inputIsValid($refs?.minterInput) ? '' : 'is-error'"
        />
      </div>

      <div class="nes-field full-width pb">
        <label for="minter-address">Token Address</label>
        <input
          v-model="tokenAddress"
          id="token-address"
          ref="tokenAddressInput"
          required
          type="text"
          class="nes-input is-dark"
          :class="inputIsValid($refs?.tokenAddressInput) ? '' : 'is-error'"
        />
      </div>
      <!-- ORIGINAL SEARCH BTN -->
      <!-- <button
        value="SEARCH"
        @click.prevent="onSearch"
        ::text="addBtnText"
        class="search-btn nes-btn ml"
        :class="!nftId ? 'is-disabled' : 'is-primary'"
      >
        <span v-if="isSearching" class="search-indicator">...</span>
        <img
          v-else
          src="../static/search-icon.svg"
          alt="magnifying glas"
          style="width: 24px; height: 24px; color: white"
        />
      </button> -->

      <div class="status-section full-width mb mt-auto">
        <error-message
          key="nftadderrors"
          v-if="formErrors.length > 0"
          :error="{ messages: formErrors || null }"
        ></error-message>
        &nbsp;
      </div>
      <div class="action-section full-width">
        <button
          ::text="addBtnText"
          type="submit"
          value="SAVE"
          class="nes-btn px"
          :class="addBtnText ? 'is-disabled' : 'is-success'"
        >
          <span v-if="isSubmitting" class="search-indicator">...</span>
          <span v-else>ADD</span>
        </button>
      </div>
    </form>
  </modal>
</template>

<style lang="css" scoped>
.form-section {
  justify-content: flex-start;
  height: 100%;
  width: min(40rem, 80vw);
}

.results-section {
  /* flex-grow: 1; */
}

.status-section {
  height: 4rem;
  display: flex;
  align-items: center;
}

.action-section {
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.search-btn {
  color: #ffffff;
  height: 50px;
  min-width: 75px;
  position: relative;
}

.search-indicator {
  position: relative;
  animation: upDown 1s linear infinite;
}

@keyframes upDown {
  0% {
    bottom: 0;
  }

  50% {
    bottom: 5px;
  }
  100% {
    bottom: 0;
  }
}
</style>
