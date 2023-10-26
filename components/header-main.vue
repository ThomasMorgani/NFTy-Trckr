<script>
import Navigation from '@/components/navigation.vue'
import PageHeader from '@/components/page-header'
import WalletButton from '@/components/wallet-button.vue'
export default {
  name: 'header-main',
  components: {
    Navigation,
    PageHeader,
    WalletButton,
  },
}
</script>

<template>
  <header class="flex-column">
    <div class="header-main flex-row flex-wrap content-between full-width">
      <section class="title-section">
        <a href="/" class="flex-row title">
          <img class="logo" src="/kirby-icon.png" />
          <!-- <i class="nes-icon reddit is-large"></i> -->
          <h1 class="nfty-text">NFTy-Trckr</h1>
        </a>
      </section>

      <section class="navigation-section ml-auto">
        <navigation>
          <!-- v-if="$store.state.documentScrollPos >= 65" -->
          <!-- <wallet-button
            v-if="$route.name !== 'index'"
            :withText="false"
          ></wallet-button> -->
        </navigation>
      </section>
      <!-- v-if="$store.state.documentScrollPos < 65" -->
      <!-- v-if="$route.name === 'index'" -->
      <section class="wallet-section flex-row">
        <wallet-button></wallet-button>
      </section>
    </div>
    <div class="header-extension full-width pb-s px-s">
      <page-header></page-header>
    </div>
  </header>
</template>
<style scoped>
header {
  padding: 0.5rem;
  position: sticky;
  top: 0;
  inset-inline: 0;

  background-color: var(--background-color);
  /* overflow: hidden; */
  z-index: 5;
}

.header-main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-inline: .5rem;
}

.header-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /* height: var(--header-height); */
  flex-shrink: 1;
  order: 1;
}

.logo {
  height: 5rem;
  width: 5.75rem;
  margin-left: -20px;
}
.navigation-section {
  display: flex;
  align-items: center;
  text-align: left;
  flex-wrap: wrap;
  order: 2;
}

.title {
  white-space: nowrap;
  /* flex-wrap: wrap; */
  text-decoration: none;
}

.wallet-section {
  align-items: center;
  justify-content: flex-end;
  order: 3;
}

@media screen and (max-width: 420px) {
  .navigation-section {
    /* flex-direction: row-reverse; */
    /* flex-grow: 1; */
    margin-left: unset;
    order: 2;
  }
  .wallet-section {
    /* align-self: end; */
    order: 3;
  }
}

@media screen and (min-width: 420px) and (max-width: 700px) {
  .header-section {
    margin: unset;
  }
  .navigation-section {
    /* flex-direction: row-reverse; */
    /* flex-grow: 1; */
    margin-left: unset;
    order: 3;
  }
  .wallet-section {
    order: 2;
    margin-left: auto;
    /* align-self: end; */
    /* width: 100%; */
  }
}

/* @media screen and (max-width: 700px) {
  .header-section {
    flex-direction: column;
    justify-content: flex-start;
  }
  .wallet-section {
    justify-content: flex-start;
  }
} */
</style>
