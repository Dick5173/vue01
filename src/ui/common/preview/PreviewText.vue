<template lang="pug">
  div.preview-text {{resource.text}}
</template>

<script>
  export default {
    props: {
      resource: {
        type: Object,
        default () {
          return {}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .preview-text {
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
  }
</style>
