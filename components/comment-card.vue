<script>
export default {
  name: 'comment-card',
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
}
</script>
<template>
  <div class="nes-container is-rounded is-dark">
    <p>{{ comment.data.body }}</p>
  </div>
</template>

<style></style>
