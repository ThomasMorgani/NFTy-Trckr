<script>
export default {
  name: 'extend-button',
  props: {
    isExtended: {
      type: Boolean,
      default: () => false,
    },
  },
}
</script>

<template>
  <button
    role="button"
    class="extend-button nes-btn"
    :class="{ show: isExtended }"
    @click="$emit('click')"
  >
    <!-- <div class="icon"></div> -->
    <img src="/caret-down-black.png" alt="" />
  </button>
</template>

<style scoped>
.extend-button {
  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  text-decoration: none;
  cursor: var(--cursor-pointer);
  height: 25px;
  width: 25px;
  padding: 0px;
  text-align: center;
  z-index: 1;
}

.extend-button img {
  height: 15px;
  width: 15px;
  pointer-events: none;
  transform: rotateX(0deg);
  transition: transform 0.5s linear;
}

.extend-button.show img {
  transform: rotateX(180deg);
  transition: transform 0.5s linear;
}
</style>
