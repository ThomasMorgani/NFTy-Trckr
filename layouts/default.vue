<script>
import 'nes.css/css/nes.min.css'
import FooterMain from '@/components/footer-main.vue'
import HeaderMain from '@/components/header-main.vue'
import PageHeader from '@/components/page-header.vue'
import Snackbar from '@/components/snackbar.vue'
export default {
  name: 'default-layout',
  data: () => ({
    scrollPos: 0,
  }),
  components: {
    FooterMain,
    HeaderMain,
    PageHeader,
    Snackbar,
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
  },
  methods: {
    onScroll() {
      this.scrollPos = window?.document?.documentElement?.scrollTop || 0
    },
    scrollTop() {
      //todo: create content element where this
      //button is attached to. dont prefer using watchers
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
      // this.$store.dispatch('setScrollElementPos', 0)
      // return
      // if (this.$store.state.scrollElement) {
      //   this.$store.state.scrollElement.scrollTo({ top: 0, behavior: 'smooth' })
      // }
    },
  },
  mounted() {
    this.$store.dispatch('appInitialize')
    window.addEventListener('scroll', this.onScroll)
    // const routeParams = this?.$route?.params
    // if (routeParams?.view) {
    //   this.$store.dispatch('setView', routeParams.view)
    // }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
}
</script>

<template>
  <main v-if="!isLoading">
    <header-main></header-main>
    <!-- page specific sticky sub headers -->
    <!-- <page-header></page-header> -->
    <Nuxt class="nuxt flex-grow" />
    <!-- SCROLL TOP BTN -->
    <button
      type="button"
      class="nes-btn is-error scroll-btn"
      :class="{ active: scrollPos > 500 }"
      @click="scrollTop"
    >
      <span class="scroll-btn-icon">&lt;</span>
    </button>
    <snackbar></snackbar>
    <footer-main></footer-main>
  </main>
</template>
<style>
/* GLOBAL STYLES */

:root {
  --spacing-base: 2rem;
  --spacing-s: calc(var(--spacing-base) / 2);
  --background-color-dark: #212529;
  --background-color: #5b5b5b;
  --primary-color: #fff;
  /* --header-height: 6rem; */
  --border-radius: 20px;
  --border-radius-s: 10px;
  --logo-gradient: linear-gradient(
    to right,
    #f23900 0%,
    #f2b310 50%,
    #097c78 85%,
    #209cee 100%
  );
  --cursor-pointer: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC)
      14 0,
    pointer !important;
}

html {
  /* content scroll inevitable,
      always show scrollbar to prevent shift
*/
  overflow-y: auto;
}

html,
body {
  color: var(--primary-color);
  line-height: 2;
  box-sizing: border-box;
}

main {
  /* padding: var(--spacing-base); */

  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  height: 100%;
  min-height: 100vh;
  padding-bottom: 4rem; /* above footer */
  background-color: var(--background-color-dark);
  /* overflow-x: hidden; */
  /* background-color: #212529; */
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}

p {
  margin: 0;
}

input.is-disabled,
textarea.is-disabled {
  opacity: 0.7;
  border-color: rgba(118, 118, 118, 0.3);
}

label {
  white-space: nowrap;
}

.nfty-text {
  margin-bottom: 0;
  background: #f2b310;
  color: transparent;
  background-clip: text;
  background: var(--logo-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nfty-text:hover {
  margin-bottom: 0;
  background: #f2b310;
  color: transparent;
  background-clip: text;
  background: linear-gradient(
      to right,
      #f23900 0%,
      #f2b310 50%,
      #097c78 85%,
      #209cee 100%
    )
    0 0 / 400% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: move-bg 8s linear infinite;
}

/* NES OVERRIDES */

.nes-btn,
.nes-input,
.nes-select select {
  /* chrome doesnt like this set to repeat */
  border-image-repeat: stretch !important;
}

.nes-btn.is-disabled,
.nes-btn.is-disabled:focus,
.nes-btn.is-disabled:hover {
  color: #212529;
  cursor: not-allowed;
  background-color: #d3d3d3;
  box-shadow: inset -4px -4px #adafbc;
  opacity: 0.6;
}

.nes-container.with-title > .title {
  /* background-color: var(--background-color) !important; */
  margin: -2.4rem 0 1rem;
}

.nes-container.is-rounded {
  /* chrome doesnt like this set to repeat */
  border-image-repeat: stretch !important;
  border-radius: var(--border-radius);
}

.nes-dialog {
  border-radius: var(--border-radius);
}

.nes-radio {
  margin-right: 0px;
}

/* UTILITY */

.align-center {
  align-content: center;
  align-items: center;
}

.align-start {
  align-content: start;
  align-items: start;
}

.d-block {
  display: block;
}

.content-between {
  justify-content: space-between;
}

.content-center {
  justify-content: center;
}

.content-end {
  justify-content: end;
}

.content-start {
  justify-content: start;
}

.disable-scroll {
  overflow: hidden !important;
}

.is-off {
  /* btn toggle switched off */
  filter: grayscale(0.75);
}

.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-row {
  display: flex;
  align-items: center;
}

.flex-end {
  align-items: flex-end;
}

.flex-grow {
  flex-grow: 1;
  flex-shrink: 0;
}

.flex-no-wrap {
  flex-wrap: nowrap;
}

.flex-shrink {
  flex-grow: 0;
  flex-shrink: 1;
}

.flex-wrap {
  flex-wrap: wrap;
}

.full-height {
  position: relative;
  height: 100%;
  top: 0;
  bottom: 0;
}

.full-width {
  width: 100%;
}

.m0 {
  margin: 0px;
}

.ma {
  margin: var(--spacing-base);
}

.mb {
  margin-bottom: var(--spacing-base);
}

.mb-s {
  margin-bottom: var(--spacing-s);
}

.mb-auto {
  margin-bottom: auto;
}

.ml {
  margin-left: var(--spacing-base);
}

.ml-auto {
  margin-left: auto;
}

.ml-s {
  margin-left: var(--spacing-s);
}

.mr {
  margin-right: var(--spacing-base);
}

.mr-auto {
  margin-right: auto;
}

.mr-s {
  margin-right: var(--spacing-s);
}

.mt {
  margin-top: var(--spacing-base);
}

.mt-auto {
  margin-top: auto;
}

.mt-s {
  margin-top: var(--spacing-s);
}

.mx {
  margin-inline: var(--spacing-base);
}

.mx-auto {
  margin-inline: auto;
}

.my {
  margin-block: var(--spacing-base);
}

.p0 {
  padding: 0px;
}

.pa {
  padding: var(--spacing-base);
}

.pa-s {
  padding: var(--spacing-s);
}

.pb {
  padding-bottom: var(--spacing-base);
}

.pb-s {
  padding-bottom: var(--spacing-s);
}

.pl {
  padding-left: var(--spacing-base);
}

.pr {
  padding-right: var(--spacing-base);
}

.pt {
  padding-top: var(--spacing-base);
}

.px {
  padding-inline: var(--spacing-base);
}

.px-s {
  padding-inline: var(--spacing-s);
}

.py {
  padding-block: var(--spacing-base);
}

.py-s {
  padding-block: var(--spacing-s);
}

.pointer {
  cursor: var(--cursor-pointer);
}

.pointer-none {
  pointer-events: none;
}

.pos-relative {
  position: relative;
}

.text-no-wrap {
  white-space: nowrap;
}

.text-left {
  text-align: left;
}

/* COMPONENTS */

.section {
  position: relative;
  display: flex;
  flex-direction: column;
  /* align-items: flex-start; */
  padding: var(--spacing-base);
}

.action-btn {
  line-height: 1;
  font-weight: bold;
  font-size: 1.5rem;
  height: 48px;
  width: 48px;
}

.action-btn img {
  height: 24px;
  width: 24px;
}

/* Scroll back to top */
.scroll-btn {
  position: fixed;
  bottom: -60px;
  right: var(--spacing-base);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease;
  z-index: 19;
}
.scroll-btn.active {
  bottom: 25px;
}
.scroll-btn > span {
  display: block;
  transform: rotateZ(90deg);
}
.scroll-btn-icon {
  margin-right: 0.25rem;
}

.text-left {
  text-align: left;
}

/* animations */
.fade-in {
  animation: fadeIn 2s;
}

.rotate {
  animation: rotation 1s infinite linear;
}

.list-enter-active,
.list-leave-active,
.list-move {
  transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
}

.list-enter {
  opacity: 0;
  transform: translateX(50px) scaleY(0.5);
}

.list-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}

.list-leave-active {
  position: absolute;
}

.list-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}

/* keyframes */

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes move-bg {
  to {
    background-position: -400% 0;
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
</style>
