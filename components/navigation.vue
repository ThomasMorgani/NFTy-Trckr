<script>
export default {
  name: 'navigation',
  methods: {
    onNav() {
      //If on current route, set view to default
      // this.$store.dispatch('setView', null)
    },
  },
}
</script>
<template>
  <nav class="nav-wrapper">
    <NuxtLink to="/market" exact>
      <img src="/pipe-top.png" alt="" class="nav-icon" />
    </NuxtLink>
    <NuxtLink
      active-class="is-primary nav-link-active"
      text="Manage Collections and NFTs"
      to="/collections"
      class="nes-text nav-link"
      @click.native="onNav"
    >
      Library
    </NuxtLink>
    |
    <NuxtLink
      active-class="is-primary nav-link-active"
      text="Track collection holders"
      to="/tracker"
      class="nes-text nav-link"
    >
      Trckr</NuxtLink
    >
    <slot></slot>
  </nav>
</template>
<style lang="css" scoped>
.nav-wrapper {
  display: flex;
  flex-grow: 1;
  align-items: center;
  /* justify-content: flex-end; */
}

.nav-icon {
  height: 1.75rem;
  width: 1.75rem;
  margin-bottom: 0.25rem;
}

.nav-link {
  color: #fff;
  padding-inline: 0.75rem;
}

.nav-link-active {
  text-decoration: underline;
  color: #209cee;
}
</style>
