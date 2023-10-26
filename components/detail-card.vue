<script>
import utils from '@/services/utils'
export default {
  name: 'detail-card',
  props: {
    clipboardKey: {
      type: String,
      default: () => 'value',
    },
    detail: {
      type: Object,
      required: true,
    },
    link: {
      type: Object,
    },
    showActions: {
      type: Boolean,
      default: () => true,
    },
  },
  methods: {
    async copyToClipboard() {
      await utils.copyToClipboard(this.detail?.[this.clipboardKey] || '')
      this.$store.dispatch('setSnackbar', { show: true, text: 'Value copied!' })
    },
  },
}
</script>
<template>
  <div class="detail-card">
    <p class="content">
      <span class="text nes-text is-primary">{{ detail.detail }}</span>
      <span :text="detail.value || ''" class="text value-text">{{
        detail.value
      }}</span>
    </p>
    <div v-if="showActions" class="actions flex-column">
      <a :href="link?.href || false" target="_blank" title="View on etherscan">
        <img
          class="nes-avatar is-small"
          :class="{ disabled: !link?.href }"
          alt="copy to clip board"
          src="/external-link-icon.png"
          style="image-rendering: pixelated"
        />
      </a>
      <img
        class="nes-avatar is-small pointer"
        alt="copy to clip board"
        src="/clipboard-copy.png"
        title="Copy to clipboard"
        style="image-rendering: pixelated"
        @click="copyToClipboard"
      />
    </div>
  </div>
</template>
<style lang="css" scoped>
a {
  display: inline-block;
  line-height: 16px;
}
.disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.detail-card {
  display: flex;
  -webkit-box-align: center;
  align-items: flex-start;
  height: 4rem;
  width: 100%;
  max-width: 40rem;
  margin-block: 0.25rem;
  /* margin: 0 0.5rem 0.5rem 0; */
  border: 1px solid var(--primary-color);
  padding: 8px;
  border-radius: 2px;
}

.content {
  flex: 1 1 0%;
  display: flex;
  line-height: 16px;
  overflow: hidden;
  margin: 0px;
  font-weight: 700;
  color: rgb(21, 21, 21);
  flex-direction: column;
  -webkit-box-pack: center;
  align-items: flex-start;
  justify-content: center;
  font-size: 1rem;
  max-width: 100%;
}

.text {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-align: left;
  font-size: 0.85rem;
}

.value-text {
  font-size: 0.55rem;
  padding: 5px 10px 0 0;
  color: var(--primary-color);
}

.actions {
  height: 100%;
  padding-left: 0.75rem;
  justify-content: space-between;
  text-align: start;
}
</style>
