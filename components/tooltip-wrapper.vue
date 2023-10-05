<script>
export default {
  name: 'tooltip-wrapper',
  props: {
    text: {
      type: String,
      default: () => '',
    },
    subtext: {
      type: String,
      default: () => '',
    },
  },
  data: () => ({
    timeoutId: null,
    showTooltip: false,
    tooltipPosition: {
      // top: 0,
      // right: 0,
      bottom: -60,
      left: 0,
    },
  }),
  computed: {},
  methods: {
    async adjustPosition() {
      this.showTooltip = true
      await this.$nextTick()
      const tooltipEl = this.$refs.tooltip
      const elPos = tooltipEl?.getBoundingClientRect()
      if (!elPos) return
      this.resetPosition(tooltipEl)
      const inlineBuffer = 20
      const blockBuffer = 20

      const viewPort = window.visualViewport
      const rightPos = elPos.right
      const rightDiff = viewPort.width - (rightPos + inlineBuffer)
      if (rightDiff < 1) {
        tooltipEl.style.left = `${rightDiff}px`
      }

      const leftPos = elPos.left
      const leftDiff = leftPos - inlineBuffer
      if (leftDiff < 1) {
        tooltipEl.style.left = `${Math.abs(leftDiff)}px`
      }

      const bottomPos = elPos.bottom
      const bottomDiff = viewPort.height - (bottomPos + blockBuffer)
      if (bottomDiff < 1) {
        const bottomAdjusted = bottomDiff - elPos.height / 2
        tooltipEl.style.bottom = `${Math.abs(bottomAdjusted)}px`
      }

      return true
    },
    async onMouseEnter() {
      const timeoutPeriod = 750
      if (!this.text) return
      this.timeoutId = setTimeout(
        async () => await this.adjustPosition(),
        timeoutPeriod
      )
    },
    onMouseLeave() {
      //clear timeoutId
      clearTimeout(this.timeoutId)
      const tooltipEl = this.$refs.tooltip
      this.resetPosition(tooltipEl)
      this.showTooltip = false
      return true
    },
    resetPosition(el) {
      if (!el?.style) return
      Object.entries(this.tooltipPosition).forEach(
        ([side, position]) => (el.style[side] = `${position}px`)
      )
      return el
    },
  },
  created() {
    if (this.subtext) this.tooltipPosition.bottom = -80
  },
}
</script>

<template>
  <!-- :data-title="text" -->
  <span
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    class="tooltip-wrapper"
  >
    <span
      v-if="showTooltip"
      ref="tooltip"
      class="tooltip-content"
      :class="{ show: showTooltip }"
      v-html="subtext ? `${text} <br />${subtext}` : text"
    >
    </span>
    <slot></slot>
  </span>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
}

.tooltip-content {
  /* content: attr(data-title) '\a'attr(data-title2); */
  background-color: var(--background-color-dark);
  color: var(--primary-color);
  position: absolute;
  padding: 0.5rem;
  font-size: 0.75rem;
  /* left: -999px; */
  /* right: 0; */
  max-width: 90vw;
  transform: translate(-50%);
  white-space: pre;
  box-shadow: 1px 1px 3px #222222;
  border: 1px solid #111111;
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  border-radius: 10px;
  /* mimick nes css */
  border-style: solid;
  border-color: var(--primary-color);
  border-width: 4px;
  border-image-repeat: stretch !important;
  border-image-slice: 3;
  border-image-width: 3;
  border-image-repeat: stretch;
  border-image-source: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="8" height="8" xmlns="http://www.w3.org/2000/svg"><path d="M3 1 h1 v1 h-1 z M4 1 h1 v1 h-1 z M2 2 h1 v1 h-2 z M5 2 h1 v1 h-1 z M1 3 h1 v1 h-1 z M6 3 h1 v1 h-1 z M1 4 h1 v1 h-1 z M6 4 h1 v1 h-1 z M2 5 h1 v1 h-1 z M5 5 h1 v1 h-1 z M3 6 h1 v1 h-1 z M4 6 h1 v1 h-1 z" fill="rgb(255,255,255)" /></svg>');
  border-image-outset: 2;
}

.tooltip-content.show {
  opacity: 1;
  visibility: visible;
  /* content: attr(data-title) '\a'attr(data-title2); */
}
</style>
