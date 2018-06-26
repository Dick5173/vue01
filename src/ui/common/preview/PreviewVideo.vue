<template lang="pug">
  div.preview-video
    div.preview-text {{resource.text}}
    video(:src="resource.url", controls="controls")
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
    data () {
      return {showPlay: true}
    },
    mounted () {
      this.$eventBus.on('eventPreviewVideo', (val) => {
        this.showPlay = val
      })
    }
  }
</script>

<style lang="scss" scoped>
  .preview-video {
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
    .preview-text {
      word-wrap:break-word;
      text-align: left;
      padding-left: 5px;
      padding-right: 5px;
      white-space: pre-wrap;
    }
  }
</style>
