<script>
import ErrorMessage from '@/components/error-message.vue'
import Modal from '@/components/modal.vue'

import loopring from '@/services/loopring.js'
import db from '@/services/db.js'
import utils from '~/services/utils'
import collectionMixin from '~/mixins/collection-mixin.vue'
import nftMixin from '~/mixins/nft-mixin.vue'
export default {
  name: 'collection-edit',
  components: {
    ErrorMessage,
    Modal,
  },
  mixins: [collectionMixin, nftMixin],
  data: () => ({
    addressesFailed: [],
    collection: {},
    errorsChecked: ['badInput', 'patternMismatch', 'tooLong', 'valueMissing'],
    errorsMap: {
      badInput: {
        nameInput: 'Name field bad input.',
        addressInput: 'Address field bad input.',
      },
      isReadonly: {
        message: 'Base collections cannot be modified.',
      },
      patternMismatch: {
        nameInput: 'Name must be alphanumeric characters only.',
        addressInput: 'Address pattern error.',
      },
      tooLong: {
        nameInput: 'Name can be a maximum of 80 characters.',
        addressInput: 'Address can be a maximum of 80 characters.',
      },
      valueMissing: {
        nameInput: 'Collection name cannot be blank.',
        addressInput: 'Wallet address cannot be blank.',
      },
    },
    formErrors: [],
    isDisabled: false,
    isSubmitting: false,
    modalConfirmDelete: false,
    type: 'custom',
    typeOptions: ['custom', 'wallet'],
  }),
  computed: {
    refs() {
      return this.$refs
    },
    collections() {
      return this.$store.state.collections
    },
    isReadonly() {
      return this.collection.id === 'nfty'
    },
    noteText: {
      get() {
        return this.collection.note
      },

      set(v) {
        this.collection.note = v
      },
    },
  },
  methods: {
    getValidityValues(e = {}) {
      const values = this.errorsChecked.filter((error) => e.validity[error])
      return values
    },
    inputIsValid(e) {
      //if not yet mounted, do not "pre" invalidate
      if (!e?.validity) return true
      return e?.validity?.valid
    },
    modalConfirmDeleteToggle() {
      this.modalConfirmDelete = !this.modalConfirmDelete
    },
    onAddCollection() {},
    async onDeleteCollection() {
      if (this.isReadonly) {
        //TODO: fix message; if is builtin, if is connected wallet
        this.formErrors = [this.errorsMap.isReadonly.message]
        return
      }
      if (!this.modalConfirmDelete) {
        this.modalConfirmDelete = true
        return
      }

      try {
        await this.collectionDelete(this.collection.id)
        this.$store.dispatch('setModalData', {})
        this.$store.dispatch('toggleModal', null)
        this.$store.dispatch('setSnackbar', {
          show: true,
          text: 'Collection deleted',
        })
      } catch (e) {
        isValid = e
        //default error
        if (this.formErrors.length < 1)
          this.formErrors.push('Error encountered deleting collection.')
      }
      this.modalConfirmDelete = false
    },

    async onSubmit() {
      if (this.isSubmitting) return
      if (this.isReadonly) {
        //TODO: fix message; if is builtin, if is connected wallet
        this.formErrors = ['Base collections cannot be modified.']
        return
      }
      this.isSubmitting = true
      let isValid = false
      try {
        isValid = await this.validateForm()
      } catch (e) {
        isValid = e
        //default error
        if (this.formErrors.length < 1)
          this.formErrors.push('Error encountered saving colleciton.')
      }
      if (!isValid) {
        this.isSubmitting = false
        return
      }
      const isNew = !this.collection.id
      this.collectionUpsert(this.collection)
      this.$store.dispatch('setSnackbar', {
        show: true,
        text: `Collection ${isNew ? 'add' : 'updat'}ed!`,
      })
      this.$store.dispatch('setModalData', {})
      this.$store.dispatch('toggleModal', false)

      this.isSubmitting = false
      return
    },
    updateCollection() {
      console.log('updateCollection method.. create me')
    },
    async validateForm() {
      this.formErrors = []
      const { nameInput, addressInput } = this.$refs

      return new Promise(async (res, rej) => {
        // NAME VALIDATION
        // html params validity
        //TODO: logic for returning multiple errors
        nameInput.reportValidity()
        if (!this.inputIsValid(nameInput)) {
          const errors = this.getValidityValues(nameInput)
          errors.forEach((e) =>
            this.formErrors.push(this.errorsMap[e].nameInput)
          )
          return rej(false)
        }

        //Detect duplicate name
        if (
          this.collection.name.toLowerCase() !==
          this.$store?.state?.modalData?.name?.toLowerCase()
        ) {
          const matchingName = this.collections.find(
            (c) =>
              c?.name?.toLowerCase() === this.collection.name.toLowerCase() &&
              c.id !== this.collection.id
          )
          if (matchingName !== undefined) {
            this.formErrors.push('Collection name already exists.')
            return rej(false)
          }
        }

        // WALLET VALIDATION
        if (this.type === 'wallet') {
          // html params validity
          addressInput.reportValidity()
          if (!this.inputIsValid(addressInput)) {
            const errors = this.getValidityValues(addressInput)
            errors.forEach((e) =>
              this.formErrors.push(this.errorsMap[e].addressInput)
            )

            return rej(false)
          }

          //  //Detect duplicate address
          const matchingAddress = this.collections.find(
            (c) =>
              c.address &&
              c.address === this.collection.address &&
              c.id !== this.collection.id
          )
          if (matchingAddress !== undefined) {
            this.formErrors.push(
              `Address already being tracked in collection: ${matchingAddress.name}`
            )

            return rej(false)
          }

          //keep temp list of known failed address, prvent spamming req
          if (this.addressesFailed.includes(this.collection.address)) {
            this.formErrors.push('Wallet address not found.')
            return rej(false)
          }

          //if collection has accountId set and wallet === address assume isValid

          if (
            this.collection?.wallet?.accountId &&
            this.collection?.wallet.address === this.collection.address
          ) {
            res(true)
          }
          try {
            const accountInfo = await loopring.getAccountInfo(
              null,
              this.collection.address
            )
            const wallet = {
              address: accountInfo.owner,
              accountId: accountInfo.accountId,
            }
            this.collection = { ...this.collection, wallet }
          } catch (e) {
            if (e.response?.status === 400) {
              this.addressesFailed.push(this.collection.address)
              this.formErrors.push('Wallet address not found.')
            }
          }
        }
        res(true)
      })
    },
  },
  created() {
    this.collection = { ...this.defaultCollection }
    if (this?.$store?.state?.modalData?.id) {
      this.collection = {
        ...this.collection,
        ...this.$store.state.modalData,
      }
    }
    if (this.collection.address) this.type = 'wallet'
    this.$nextTick(() => this.$refs.nameInput.focus())
  },
}
</script>
<template>
  <modal :isOpen="$store.state.modal === 'collection-edit'">
    <Modal
      :closeEvent="modalConfirmDeleteToggle"
      :isOpen="modalConfirmDelete"
      :overlayEvent="modalConfirmDeleteToggle"
      ><div class="pa">
        <h2 class="title nes-text is-warning">CONFIRM DELETE</h2>
        <button
          text="Delete collection"
          @click.prevent="onDeleteCollection"
          class="nes-btn is-error full-width mt"
        >
          DELETE
        </button>
      </div></Modal
    >
    <h2 class="title nes-text is-primary">
      {{ `${collection.id ? 'Edit' : 'New'} Collection` }}
    </h2>
    <form ref="form" @submit.prevent="onSubmit" novalidate="true">
      <section class="form-section flex-column full-width" @click.stop="">
        <div class="nes-field full-width pb">
          <label for="name">Name</label>
          <input
            v-model="collection.name"
            id="name"
            ref="nameInput"
            maxlength="80"
            pattern="[a-zA-Z0-9 \-_]+"
            :readonly="isReadonly"
            required
            type="text"
            class="nes-input is-dark"
            :class="
              isReadonly
                ? 'is-disabled'
                : inputIsValid($refs?.nameInput)
                ? ''
                : 'is-error'
            "
          />
        </div>

        <div class="full-width pb">
          <label for="dark_select">Type</label>
          <div class="nes-select is-dark">
            <select
              v-model="type"
              required
              id="dark_select"
              :disabled="isReadonly || collection.id"
              :readonly="isReadonly || collection.id"
              :class="
                isReadonly || collection.id
                  ? 'is-disabled'
                  : !addressesFailed.includes(collection.address) &&
                    inputIsValid($refs?.addressInput)
                  ? ''
                  : 'is-error'
              "
            >
              <option v-for="type in typeOptions" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>
        <div v-if="type === 'wallet'" class="nes-field full-width pb">
          <label for="wallet-address">Wallet address</label>
          <input
            v-model="collection.address"
            id="wallet-address"
            ref="addressInput"
            maxlength="80"
            :readonly="isReadonly || collection.id"
            required
            type="text"
            class="nes-input is-dark"
            :class="
              isReadonly || collection.id
                ? 'is-disabled'
                : !addressesFailed.includes(collection.address) &&
                  inputIsValid($refs?.addressInput)
                ? ''
                : 'is-error'
            "
          />
        </div>

        <div class="full-width pb">
          <label for="note">Note</label>
          <textarea
            v-model="collection.note"
            id="note"
            :readonly="isReadonly"
            class="nes-textarea is-dark"
            :class="
              isReadonly
                ? 'is-disabled'
                : inputIsValid($refs?.nameInput)
                ? ''
                : 'is-error'
            "
          ></textarea>
        </div>
        <div class="status-section full-width mb">
          <error-message
            v-if="formErrors.length > 0"
            :error="{ messages: formErrors || null }"
          ></error-message>
          &nbsp;
        </div>
        <div class="action-section full-width">
          <tooltip-wrapper text="Delete collection" class="mr-auto">
            <button
              v-if="collection.id"
              @click.prevent="onDeleteCollection"
              class="nes-btn is-error mr-auto"
              :class="isReadonly ? 'is-disabled' : 'is-success'"
            >
              DELETE
            </button>
          </tooltip-wrapper>
          <span
            :text="
              isReadonly
                ? errorsMap.isReadonly.message
                : isDisabled
                ? ''
                : `${collection.id ? 'Update' : 'Save'}  collection`
            "
          >
            <button
              type="submit"
              value="SAVE"
              class="nes-btn"
              :class="isSubmitting || isReadonly ? 'is-disabled' : 'is-success'"
            >
              {{ isSubmitting ? '...' : 'SAVE' }}
            </button>
          </span>
        </div>
      </section>
    </form>
  </modal>
</template>

<style lang="css" scoped>
.form-section {
  justify-content: flex-start;
  height: 100%;
  width: min(40rem, 80vw);
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
</style>
