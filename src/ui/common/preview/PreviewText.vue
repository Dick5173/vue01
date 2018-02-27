<template lang="pug">
  div.preview-text
    div(v-html="text(resource.text)")
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
    },
    methods: {
      text (text) {
        let data = text.replace(/\n/g, '<br/>')
        return data
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
