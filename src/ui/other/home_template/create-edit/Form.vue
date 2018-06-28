<template lang="pug">
  div
    div
      el-input(v-model="minPage.name", placeholder="模板名称", style="width: 300px")
    div.form-content
      div.left(ref="parentTree")
        div.navigation(ref="navBar", @click="handleClickTitleBar")
          div.title {{minPage.name}}
          div.more ● ● ●
        draggable(ref="draggableTree", :list="dataList", :move="handleMove", :options="{animation: 200, ghostClass: 'ghost', chosenClass: 'can-move', handle: '.can-move'}")
          div.info-content(v-for="item, index in dataList", @mouseenter="handleMouseenter(item)", @mouseleave="handleMouseleave", @click="handleClickItem(item, index)")
            div.info-show-content(:class="{selected: index === editIndex}", v-show="isShowItem(item)")
              div.add.top(v-if="showTopAdd(item)")
                div.btn(@click.stop="handleAdd(true, index)") +
              component(class="can-move", :queryParams.sync!="item", :is="getCompByColumn(item)")
              <!--div.error-content(v-if="item.error && isErrorItem(item)") {{item.error}}-->
              el-popover.delete-popover(ref="`popoverDelete${index}`", placement="left", width="160", v-model="item.showPopover")
                p 确定删除？
                div(style="text-align: right; margin: 0")
                  el-button(size="mini", type="text", @click="item.showPopover = false") 取消
                  el-button(size="mini", type="primary", @click="handleClickDelete(item, index)") 确定
              div.delete(v-if="showDelete(item)", v-popover="`popoverDelete${index}`", @click.stop="showDeletePopover(item)") X
              div.add.bottom(v-if="showBottomAdd(item)")
                div.btn(@click.stop="handleAdd(false, index)") +
      div.right
        div(:style="rightEmptyHeight")
        share-text(ref="shareText", v-if="isShowShareText", :queryParams.sync="minPage")
        component(:ref="`editComponent${editIndex}`", v-if="editIndex >= 0", :queryParams.sync!="dataList[editIndex]", :is="getCompByEdit(dataList[editIndex])")
        select-category(ref="selectCategory", :isMinPage="minPage.tp===allPageTp.min.value", :hasNavigate="hasNavigate", :hasChannel="hasChannel", @selectCategory="handleCategory")
    div(style="height: 80px")
    bottom-container.bottom
      el-button(type="primary", @click="save", :loading="loading", :disabled="saveDisabled") 提交
</template>

<script>
  import * as CustomPageService from 'src/service/home_template/index'
  import * as TmplApi from 'src/api/home-template'
  import draggable from 'vuedraggable'

  import ShareText from './edit/ShareText'
  import SelectCategory from './edit/SelectCategory'
  import Navigate from './preview/Navigate'
  import Product from './preview/Product'
  import Channel from './preview/Channel'
  import HomeImage from './preview/Image'
  import Banner from './preview/Banner'
  import FastIn from './preview/FastIn'
  import HomeText from './preview/Text'
  import BuyGroup from './preview/BuyGroup'
  import Voucher from './preview/Voucher'
  import EditBanner from './edit/EditBanner'
  import EditBuyGroup from './edit/EditBuyGroup'
  import EditChannel from './edit/EditChannel'
  import EditFastIn from './edit/EditFastIn'
  import EditNavigate from './edit/EditNavigate'
  import EditProduct from './edit/EditProduct'
  import EditText from './edit/EditText'
  import EditImage from './edit/EditImage'
  import EditVoucher from './edit/EditVoucher'
  import html2canvas from 'html2canvas'
  import * as UploadApi from 'src/api/upload'

  export default {
    components: {
      draggable,
      ShareText,
      SelectCategory,
      Navigate,
      Product,
      Channel,
      HomeImage,
      Banner,
      FastIn,
      HomeText,
      BuyGroup,
      Voucher,
      EditBanner,
      EditBuyGroup,
      EditChannel,
      EditFastIn,
      EditNavigate,
      EditProduct,
      EditText,
      EditImage,
      EditVoucher
    },
    props: {
      showAll: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        minPage: {
          name: '',
          capture_image: {
            tp: 1,
            url: '',
            width: 0,
            height: 0
          },
          items: []
        },
        serverNow: 0,
        loading: false,
        firstIn: true,
        titleName: '',
        saveDisabled: true,
        diffNow: 0,
        hoverShowId: 0,
        showShareText: false,
        editIndex: -1,
        rightHeight: 0,
        addIndex: 0,
        editContentTp: 1,
        ...$global.$mapConst({
          'allPageTp': CustomPageService.allPageTp,
          'allContentTp': CustomPageService.allContentTp
        })
      }
    },
    watch: {
      serverNow (val) {
        this.diffNow = val - new Date().getTime()
      },
      minPage: {
        handler (val) {
          if (!val.items || val.items.length === 0) {
            this.emptyShowCategory()
          } else if (!this.firstIn) {
            this.saveDisabled = false
          }
          this.firstIn = false
        },
        deep: true
      }
    },
    computed: {
      dataList: {
        get () {
          if (!this.minPage || !this.minPage.items) {
            this.minPage.items = []
          }
          return this.minPage.items
        },
        set (val) {
          this.minPage.items = val
        }
      },
      isEditMode () {
        return this.$route.name === 'HomeTemplateEdit'
      },
      isEmpty () {
        return !this.dataList || this.dataList.length === 0
      },
      isShowShareText () {
        return this.showShareText || this.isEmpty
      },
      rightEmptyHeight () {
        return `height: ${this.rightHeight}px`
      },
      hasNavigate () {
        return this.dataList.some((item) => {
          return item.wgt_tp === CustomPageService.allContentTp.navigate.value
        })
      },
      hasChannel () {
        return this.dataList.some((item) => {
          return item.wgt_tp === CustomPageService.allContentTp.channel.value
        })
      }
    },
    methods: {
      setSaveDisabled (disable) {
        this.saveDisabled = disable
      },
      isShowItem (item) {
        if (this.showAll) {
          return true
        } else {
          let currentServerCt = new Date().getTime()
          if (this.serverNow !== 0) {
            currentServerCt = new Date().getTime() + this.diffNow
          }
          if (item.wgt_tp !== CustomPageService.allContentTp.banner.value) {
            if (item.online_tp === CustomPageService.allShowTp.show_long.value || (item.online_start < currentServerCt && item.online_end > currentServerCt)) {
              return true
            }
            return false
          } else {
            const out = item.wgt_carousel.items.some((item) => {
              return item.online_tp === CustomPageService.allShowTp.show_limit.value && (item.online_start > currentServerCt || item.online_end < currentServerCt)
            })
            return !out
          }
        }
      },
      // isErrorItem (item) {
      //   return CustomPageService.isErrorItem(item)
      // },
      emptyShowCategory () {
        this.$refs.selectCategory.show(0)
      },
      getCompByColumn (item) {
        switch (item.wgt_tp) {
          case CustomPageService.allContentTp.navigate.value:
            return 'Navigate'
          case CustomPageService.allContentTp.product.value:
            return 'Product'
          case CustomPageService.allContentTp.channel.value:
            return 'Channel'
          case CustomPageService.allContentTp.image.value:
            return 'HomeImage'
          case CustomPageService.allContentTp.banner.value:
            return 'Banner'
          case CustomPageService.allContentTp.fast_in.value:
            return 'FastIn'
          case CustomPageService.allContentTp.text.value:
            return 'HomeText'
          case CustomPageService.allContentTp.buy_group.value:
            return 'BuyGroup'
          case CustomPageService.allContentTp.voucher.value:
            return 'Voucher'
        }
      },
      getCompByEdit (item) {
        if (!item) {
          return ''
        }
        switch (item.wgt_tp) {
          case CustomPageService.allContentTp.navigate.value:
            return 'EditNavigate'
          case CustomPageService.allContentTp.product.value:
            return 'EditProduct'
          case CustomPageService.allContentTp.channel.value:
            return 'EditChannel'
          case CustomPageService.allContentTp.image.value:
            return 'EditImage'
          case CustomPageService.allContentTp.banner.value:
            return 'EditBanner'
          case CustomPageService.allContentTp.fast_in.value:
            return 'EditFastIn'
          case CustomPageService.allContentTp.text.value:
            return 'EditText'
          case CustomPageService.allContentTp.buy_group.value:
            return 'EditBuyGroup'
          case CustomPageService.allContentTp.voucher.value:
            return 'EditVoucher'
        }
      },
      handleMouseenter (item) {
        this.hoverShowId = item.show_id
      },
      handleMouseleave () {
        this.hoverShowId = 0
      },
      showTopAdd (item) {
        if (item.wgt_tp === CustomPageService.allContentTp.navigate.value) {
          return false
        } else if (item.wgt_tp === CustomPageService.allContentTp.channel.value && this.hasNavigate) {
          return false
        } else {
          return item.show_id === this.hoverShowId
        }
      },
      showBottomAdd (item) {
        if (item.wgt_tp === CustomPageService.allContentTp.navigate.value && this.hasChannel) {
          return false
        }
        return item.show_id === this.hoverShowId
      },
      showDelete (item) {
        return item.show_id === this.hoverShowId
      },
      showDeletePopover (item) {
        this.hiddenAllDelete()
        item.showPopover = true
      },
      handleClickDelete (item, index) {
        item.showPopover = false
        this.dataList.splice(index, 1)
      },
      handleClickTitleBar () {
        this.hiddenAllDelete()
        this.hiddenAllEdit()
        this.rightHeight = 0
        this.addIndex = 0
        this.showShareText = true
        this.$refs.selectCategory.show(this.addIndex)
      },
      handleClickItem (item, index) {
        this.hiddenAllDelete()
        this.showEditWithIndex(index)
      },
      handleAdd (isTop, index) {
        this.hiddenAllDelete()
        if (this.dataList.length >= 50) {
          this.$message({
            message: '最多添加50个组件，已达上限',
            type: 'error'
          })
          return
        }
        this.addIndex = isTop ? index : index + 1
        this.setRightHeightWithIndex(this.addIndex)
        this.hiddenAllEdit()
        this.$refs.selectCategory.show(this.addIndex)
      },
      handleCategory (item) {
        this.hiddenAllEdit()
        this.createWgtCell(item.value)
      },
      handleMove (evt, originalEvent) {
        this.hiddenAllEdit()
        if (evt.draggedContext.element.wgt_tp === CustomPageService.allContentTp.channel.value || evt.draggedContext.element.wgt_tp === CustomPageService.allContentTp.navigate.value) {
          return false
        } else if (evt.draggedContext.futureIndex < 2 && this.hasNavigate && this.hasChannel) {
          return false
        } else if (evt.draggedContext.futureIndex < 1 && (this.hasNavigate || this.hasChannel)) {
          return false
        }
        return true
      },
      createWgtCell (contentTp) {
        let mixIndex = 0
        if (this.hasNavigate) {
          mixIndex++
        }
        if (this.hasChannel) {
          mixIndex++
        }
        if (contentTp === CustomPageService.allContentTp.navigate.value) {
          this.addIndex = 0
        } else if (contentTp === CustomPageService.allContentTp.channel.value) {
          this.addIndex = this.hasNavigate ? 1 : 0
        } else {
          if (this.addIndex < mixIndex) {
            this.addIndex = mixIndex
          }
        }
        this.dataList.splice(this.addIndex, 0, CustomPageService.createWgtCell(contentTp))
        this.showEditWithIndex(this.addIndex, this.addIndex === 0 || this.addIndex === 1)
      },
      showEditWithIndex (index, scroll = false) {
        this.setRightHeightWithIndex(index, scroll)
        this.hiddenAllEdit()
        this.editIndex = index
        this.addIndex = index + 1
        this.$refs.selectCategory.show(this.addIndex)
      },
      hiddenAllEdit () {
        this.editIndex = -1
        this.showShareText = false
        this.$refs.selectCategory.hide()
      },
      hiddenAllDelete () {
        this.dataList.forEach((item) => {
          if (item.showPopover) {
            item.showPopover = false
          }
        })
      },
      async setRightHeightWithIndex (index, scroll = false) {
        await this.$nextTick()
        if (this.dataList.length > index) {
          const tree = this.$refs.parentTree
          const element = tree.getElementsByClassName('info-content')[index]
          const parentTop = tree.getBoundingClientRect().top
          const top = element.getBoundingClientRect().top
          this.rightHeight = top - parentTop - 20
          if (scroll) {
            await this.$nextTick()
            element.scrollIntoView()
          }
        } else if (this.dataList.length > (index - 1)) {
          const tree = this.$refs.parentTree
          const element = tree.getElementsByClassName('info-content')[index - 1]
          const parentTop = tree.getBoundingClientRect().top
          const top = element.getBoundingClientRect().top
          const height = element.getBoundingClientRect().height
          this.rightHeight = top - parentTop + height - 20
          if (scroll) {
            await this.$nextTick()
            element.scrollIntoView()
          }
        } else {
          this.rightHeight = 44 - 20
        }
      },
      async save () {
        if (!this.minPage.name || this.minPage.name === '') {
          this.$message({
            message: '请输入标题',
            type: 'error'
          })
          this.hiddenAllEdit()
          this.showShareText = true
          await this.$nextTick()
          this.$refs.shareText.formValidate()
          return
        }
        this.editIndex = CustomPageService.checkInputInfo(this.dataList)
        if (this.editIndex > -1) {
          this.showEditWithIndex(this.editIndex, true)
          await this.$nextTick()
          this.$refs[`editComponent${this.editIndex}`].formValidate()
          return
        } else {
          this.hiddenAllEdit()
        }

        this.loading = true
        this.$nextTick(async () => {
          const canvas = await html2canvas(this.$refs.parentTree, {
            useCORS: true,
            width: this.$refs.parentTree.offsetWidth,
            height: this.$refs.parentTree.offsetHeight
          })
          const image = canvas.toDataURL('image/jpg')
          this.minPage.capture_image.url = await UploadApi.uploadImage(UploadApi.imageBase64toBlob(image), `${this.minPage.name}.jpg`)
          this.minPage.capture_image.width = this.$refs.parentTree.offsetWidth
          this.minPage.capture_image.height = this.$refs.parentTree.offsetHeight
          this.saveApi(this.minPage)
          this.loading = false
        })
      },
      async getMinPageList () {
        if (!this.isEditMode) {
          return
        }
        try {
          const res = await TmplApi.getTmplDetail(this.$route.params.id)
          if (res.data) {
            this.minPage = CustomPageService.convertPageContentModelToForm(res.data.data || {})
            this.serverNow = res.data.now
            if (!this.minPage.items || this.minPage.items.length === 0) {
              await this.$nextTick()
              this.emptyShowCategory()
            }
            await this.$nextTick()
            this.setSaveDisabled(true)
          }
        } finally {
        }
      },
      async saveApi (minPage) {
        try {
          this.loading = true
          const param = CustomPageService.convertHomePageFormToParam(minPage)
          if (this.isEditMode) {
            await TmplApi.updateTmpl(this.$route.params.id, param)
          } else {
            await TmplApi.createTmpl(param)
          }
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$router.back()
        } finally {
          this.loading = false
        }
      }
    },
    async mounted () {
      await this.$nextTick()
      this.$refs.navBar && this.$refs.navBar.click()
      this.getMinPageList()
    }
  }
</script>

<style lang="scss" scoped>
  .ghost {
    opacity: 0.4;
  }

  .can-move {
    cursor: move;
  }

  .form-content {
    margin-top: 10px;
    display: flex;
    width: 100%;

    .left {
      width: 377px;
      border: 1px solid #979797;
      background: #f3f3f3;
      margin-bottom: auto;

      .navigation {
        width: 100%;
        height: 44px;
        background: #151518;
        position: relative;

        .title {
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 44px;
          color: #fff;
        }

        .more {
          position: absolute;
          right: 10px;
          top: 14px;
          color: #fff;
        }
      }

      .info-content {

        .info-show-content {
          position: relative;
          box-sizing: border-box;
          border: 1px solid transparent;

          &.selected {
            border: 1px dashed $color-primary;
          }
        }

        .error-content {
          position: absolute;
          z-index: 10;
          top: 5px;
          left: 5px;
          padding: 5px 10px;
          border: 1px solid #E2E2E2;
          background: #FEECEC;
          font-size: $font-size-desc;
          color: #F26065;
          text-align: center;
        }

        .add {
          z-index: 10;
          position: absolute;
          display: flex;
          width: 100%;
          justify-content: center;
          height: 1px;
          background: $color-primary;

          &.top {
            top: 0;
            align-items: center;
          }

          &.bottom {
            bottom: 0;
            align-items: center;
          }

          .btn {
            position: absolute;
            width: 20px;
            height: 20px;
            background: $color-primary;
            border-radius: 50%;
            line-height: 15px;
            text-align: center;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
          }

        }

        .delete {
          z-index: 10;
          position: absolute;
          width: 20px;
          height: 20px;
          background: #999;
          border-radius: 50%;
          text-align: center;
          line-height: 20px;
          color: #fff;
          font-size: 14px;
          right: -10px;
          top: -10px;
          cursor: pointer;
        }

        .delete-popover {
          z-index: 11;
          position: absolute;
          right: 210px;
          top: -20px;
        }
      }
    }

    .right {
      width: 500px;
      /*height: 100%;*/
    }

    .bottom {
      z-index: 20;
    }
  }
</style>
