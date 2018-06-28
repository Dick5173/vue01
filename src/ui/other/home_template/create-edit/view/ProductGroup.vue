<template lang="pug">
  div.product-group-content
    div.error-content(v-if="isErrorItem") {{isErrorItem}}
    div.group-content(v-else)
      div.left
        div.title-content(v-if="!buyGroup")
          div 标题：
          el-input(v-model="formData.name", style="width: 220px", :maxlength="10")
        div.name 商品组：{{formData.product_group.name}}
      div.right-btn
        el-button(type="primary", plain, size="small", v-if="!isErrorItem", v-clipboard:copy="getAppUrl(formData.product_group)", v-clipboard:success="onCopy", v-clipboard:error="onError") 小程序链接
</template>

<script>
  export default {
    components: {
    },
    props: {
      queryParams: {
        type: Object,
        default () {
          return {}
        },
        required: true
      },
      buyGroup: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        formData: this.queryParams
      }
    },
    computed: {
      isErrorItem () {
        return (!this.formData.product_group || !this.formData.product_group.id) ? '商品组缺失' : null
      }
    },
    watch: {
      queryParams (val) {
        this.formData = val
      },
      formData (val) {
        this.$emit('change:queryParams', val)
      }
    },
    methods: {
      getAppUrl (row) {
        return `pages/goods/index?gid=${row.id}&isShare=1`
      },
      onError () {
        this.$message({
          type: 'danger',
          message: '复制失败'
        })
      },
      onCopy () {
        this.$message({
          type: 'success',
          message: '已复制小程序链接到剪贴板'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .product-group-content {
    background: #fff;
    border: 1px solid #d6d6d6;
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;

    .group-content {
      display: flex;
      align-items: center;
    }

    .error-content {
      margin: 10px;
      flex: 1;
      line-height: 70px;
      background: #E7F6FD;
      color: #98CAE1;
      font-size: 16px;
      text-align: center;
    }

    .left {
      width: 320px;
      margin-left: 20px;
      color: $home-color-common;
      font-size: $home-size-title;

      .title-content {
        display: flex;
        align-items: center;
      }
    }

    .right-btn {
      width: 100px;
    }
  }

  .product-group-item {
    overflow: hidden;
    text-overflow: ellipsis;
    align-items: center;
    padding: 8px;

    .title-content {
      display: flex;
      align-items: center;
    }

    .text {
      position: relative;
      height: 50px;
      flex: 1;
      min-width: 0;
    }

    .name {
      color: $home-color-common;
      font-size: $home-size-title;
      line-height: 50px;
      min-width: 0;
      width: 100%;

    }
  }

</style>
