<template lang="pug">
  div.select-category-content(v-show="showComponent")
    div.info-content
      div.title 组件
      div.category
        div(v-if="isMinPage")
          el-button.item(v-for="item in allMinPageContentTp", :key="item.value", type="primary", plain, @click="selectCategory(item)") {{item.text}}
        div(v-else)
          el-button.item(v-for="item in allContentTp", :key="item.value", type="primary", plain, :disabled="disableBtn(item)", @click="selectCategory(item)") {{item.text}}
</template>

<script>
  import * as CustomPageService from 'src/service/home_template/index'

  export default {
    props: {
      isMinPage: {
        type: Boolean,
        default: false
      },
      hasNavigate: {
        type: Boolean,
        default: false
      },
      hasChannel: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        showComponent: false,
        addIndex: 0,
        ...$global.$mapConst({
          'allContentTp': CustomPageService.allContentTp,
          'allMinPageContentTp': CustomPageService.allMinPageContentTp
        })
      }
    },
    computed: {},
    methods: {
      show (addIndex) {
        this.addIndex = addIndex
        this.showComponent = true
      },
      hide () {
        this.showComponent = false
      },
      disableBtn (item) {
        if (item.value === CustomPageService.allContentTp.channel.value && this.hasChannel) {
          // 已经存在 频道 不可再次创建
          return true
        } else if (item.value === CustomPageService.allContentTp.navigate.value && this.hasNavigate) {
          // 已经存在 搜索条 不可再次创建
          return true
        }
        return false
      },
      selectCategory (item) {
        this.$emit('selectCategory', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .select-category-content {
    width: 542px;
    margin: 10px 0;
    display: flex;

    .info-content {
      margin-left: 20px;
      width: 100%;
      height: 100%;
      padding: 10px;
      border: 1px solid #DFDFDF;
      position: relative;
      background: #F5F5F5;
      line-height: 30px;
      border-radius: 10px;

      .title {
        margin-left: 5px;
        margin-bottom: 10px;
        color: $font-color-common;
        font-size: $home-size-title;
      }

      .item {
        width: 100px;
        height: 40px;
        margin: 5px;
        display: inline-block;
      }
    }
  }
</style>
