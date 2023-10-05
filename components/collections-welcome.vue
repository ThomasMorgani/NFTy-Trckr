<template>
  <div class="welcome-container flex-column flex-grow">
    <h2 class="title">Collections</h2>
    <img src="/pokedex.png" alt="" />
    <article class="nes-container is-dark is-centered with-title">
      <p>Organize NFTs into custom groups.</p>
      <p>Collections can be used to monitor wallets and track holders.</p>
    </article>
  </div>
</template>

<script>
export default {
  name: 'collections-welcome',
}
</script>

<style lang="css" scoped>
.welcome-container {
  height: 100%;
  max-width: 700px;
  justify-content: space-around;
}

.welcome-container img {
  width: 150px;
  margin-bottom: 2rem;
}
</style>
