<template lang="pug">
  div.edit-channel-content
    left-arrow
    div.info-content
      div.top-title 频道
      el-form(ref="form", :model="this.formData.wgt_channel", :rules="formRules")
        el-form-item(label="首页：")
          el-input(style="width:300px", v-model="formData.wgt_channel.items[0].name", :maxlength="5")
        el-form-item(prop="items")
          smart-table(:dataList.sync!="showChannels", :showHeader="false", border)
            smart-table-column(type="drag")
            smart-table-column(label="商品")
              div.table-item(slot-scope="props")
                el-form-item(label="频道名称：", :ref="`name${props.index}`", :prop="`items.${props.index + 1}.name`", :rules="formRules.name")
                  el-input(style="width:200px", v-model.trim="props.row.name", :maxlength="5")
            smart-table-column(width="120px")
              div(slot-scope="props")
                el-button(style="margin-left:0; margin-top:5px; width: 100px", type="danger", size="small", @click="handleDeleteItem(props.index)") 删除
      el-button(style="margin-top:10px", type="primary", plain, size="small", :disabled="disabledAdd", @click="handleAdd") 添加
      div.select-content
        el-checkbox(v-model="checkCorner") 角标
        div.select
          el-select(v-model="selectChannelId", :disabled="!checkCorner", @change="selectChannelChange", placeholder="请选择")
            el-option(v-for="item in formData.wgt_channel.items", :key="item.show_id", :value="item.show_id", :label="item.name")
          div.radio-text
            div.text(style="margin-right:10px") 文字:
            el-radio-group(:disabled="!checkCorner", v-model="selectCorner", @change="selectCornerChange")
              el-radio(v-for="item in corners", :key="item.label", :label="item.label") {{item.value}}
            el-input(style="margin-left:10px; width: 100px", :disabled="selectCorner !== 3", v-model="diyCorner", :maxlength="3")
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'
  import * as CustomPageService from 'src/service/home_template/index'
  import DialogChannel from '../dialog/DialogChannel'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow,
      SmartTable,
      SmartTableColumn,
      DialogChannel
    },
    props: {
      queryParams: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch: {
      queryParams (val) {
        this.formData = val
      },
      formData: {
        handler (val) {
          this.$emit('update:queryParams', val)
        },
        deep: true
      },
      checkCorner (val) {
        if (!val) {
          this.selectCorner = 1
        }
        this.changeCorner()
      },
      diyCorner () {
        this.changeCorner()
      }
    },
    data () {
      const itemsValidator = (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error('不能为空'))
          return
        }
        callback()
      }
      const actionValidator = (rule, value, callback) => {
        if (value.action_tp === 0) {
          callback(new Error('请选择跳转方式'))
          return
        } else if (value.action_tp === CustomPageService.channelCustomTp.min_page.value && (!value.min_page || !value.min_page.id)) {
          callback(new Error('请选择微页面'))
          return
        } else if (value.action_tp === CustomPageService.channelCustomTp.product_group.value && (!value.product_group || !value.product_group.id)) {
          callback(new Error('请选择商品组'))
          return
        }
        callback()
      }
      return {
        formData: this.queryParams,
        formRules: {
          items: [
            {validator: itemsValidator, trigger: 'change'}
          ],
          name: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          item: [
            {validator: actionValidator, required: true, trigger: 'change'}
          ]
        },
        checkCorner: false,
        selectChannelItemId: -1,
        selectCorner: 1,
        diyCorner: '',
        corners: [
          {
            label: 1,
            value: 'NEW'
          },
          {
            label: 2,
            value: 'HOT'
          },
          {
            label: 3,
            value: '自定义'
          }
        ]
      }
    },
    computed: {
      showChannels: {
        get () {
          return this.formData.wgt_channel.items.slice(1, this.formData.wgt_channel.items.length)
        },
        set (val) {
          const newArr = [this.formData.wgt_channel.items[0]]
          this.formData.wgt_channel.items = newArr.concat(val)
        }
      },
      selectChannelId: {
        get () {
          if (this.selectChannelItemId === -1) {
            return this.formData.wgt_channel.items[0].show_id
          }
          return this.selectChannelItemId
        },
        set (val) {
          this.selectChannelItemId = val
        }
      },
      disabledAdd () {
        return this.formData.wgt_channel.items.length >= 10
      },
      getSelectCornerItem () {
        return this.corners.find((item) => {
          if (item.label === this.selectCorner) {
            return item
          }
        })
      }
    },
    methods: {
      isErrorItem (item) {
        return CustomPageService.isChannelError(item)
      },
      handleAdd () {
        const cus = CustomPageService.createChannelItem()
        this.formData.wgt_channel.items.push(cus)
      },
      isEmpty (row) {
        if (row.action === 0 || (row.action === CustomPageService.channelCustomTp.min_page.value && !row.min_page.id)) {
          return true
        }
        return false
      },
      resetCheckCorner () {
        let cornerIndex = -1
        this.formData.wgt_channel.items.some((item, index) => {
          if (item.badge && item.badge !== '') {
            cornerIndex = index
            return true
          }
          return false
        })
        if (cornerIndex > -1) {
          this.checkCorner = true
          this.selectChannelId = this.formData.wgt_channel.items[cornerIndex].show_id
          const badge = this.formData.wgt_channel.items[cornerIndex].badge
          if (badge === this.corners[0].value) {
            this.selectCorner = this.corners[0].label
          } else if (badge === this.corners[1].value) {
            this.selectCorner = this.corners[1].label
          } else {
            this.selectCorner = 3
            this.diyCorner = this.formData.wgt_channel.items[cornerIndex].badge
          }
        } else {
          this.checkCorner = false
          this.selectChannelId = -1
        }
      },
      selectChannelChange () {
        this.changeCorner()
      },
      selectCornerChange () {
        this.diyCorner = ''
        this.changeCorner()
      },
      changeCorner () {
        if (this.selectChannelId && this.checkCorner) {
          this.formData.wgt_channel.items.forEach((item) => {
            if (item.show_id === this.selectChannelId) {
              const cornerItem = this.getSelectCornerItem
              if (cornerItem.label === 3) {
                item.badge = this.diyCorner
              } else {
                item.badge = cornerItem.value
              }
            } else {
              item.badge = ''
            }
          })
        } else {
          this.formData.wgt_channel.items.forEach((item) => {
            item.badge = ''
          })
        }
      },
      handleDeleteItem (index) {
        this.formData.wgt_channel.items.splice(index + 1, 1)
        for (let i = 0; i < this.formData.wgt_channel.items.length - 1; i++) {
          this.$refs[`item${i}`] && this.$refs[`item${i}`].onFieldChange()
        }
      },
      formValidate () {
        this.$refs.form.validate(async (valid) => {
          if (!valid) {
            ElUtil.scrollToInvalidFirstElement(this.$refs.form)
          }
        })
      }
    },
    async mounted () {
      await this.$nextTick()
      this.resetCheckCorner()
    }
  }
</script>

<style lang="scss" scoped>
  .edit-channel-content {
    width: 542px;
    display: flex;

    .info-content {
      width: 100%;
      flex: 1;
      border: 1px solid #DFDFDF;
      padding: 10px;

      position: relative;
      background: #F5F5F5;
      line-height: 30px;
      border-radius: 10px;

      &:after {
        position: absolute;
        content: '';
        width: 20px;
        height: 20px;
        background: #F5F5F5;
        border-top-right-radius: 10px;
        top: 25px;
        left: -11px;
        border-bottom: solid 1px #DFDFDF;
        border-right: solid 1px #F5F5F5;
        border-top: solid 1px #F5F5F5;
        border-left: solid 1px #DFDFDF;
        transform: rotate(45deg);
      }

      .top-title {
        margin-bottom: 10px;
      }

      .table-item {
        .bottom-content {
          width: 450px;
          display: flex;

          .error-content {
            flex: 1;
            margin-top: 10px;
            height: 50px;
            width: 360px;
            line-height: 50px;
            background: #E7F6FD;
            color: #98CAE1;
            font-size: 14px;
            text-align: center;
          }

          .name-content {
            width: 300px;
            margin-top: 20px;
            flex: 1;
            display: flex;
            color: $home-color-title;
            font-size: $home-size-title;

            .name {
              flex: 1;
              @include maxLine(1);
            }
          }

          .btn {
            width: 110px;
          }

        }
      }

      .select-content {
        margin-top: 10px;
        display: flex;
        width: 100%;

        .select {
          margin-left: 10px;
          width: 100%;
          display: flex;
          flex-direction: column;

          .radio-text {
            margin-top: 5px;
            display: flex;
            align-items: center;

            .text {
              color: $home-color-title;
              font-size: $home-size-title;
            }
          }

        }
      }

    }
  }

</style>
