<template lang="pug">
  div(v-loading="loading")
    div.title-content
      span.qrcode 店铺装修参考：美市精选
        img(@click="qrcodeDialogVisible = true", style="width: 16px;", :src="qrcodeIcon")
      el-checkbox(v-model="showAllCarousel") 显示未上线内容
      a.help(href="https://shimo.im/docs/Jmo3dqcWSQEJ7eWv/", target="view_window") 小程序链接怎么用？
    el-dialog(title="小程序码", :visible.sync="qrcodeDialogVisible", width="300px", :modal-append-to-body="false", center)
      img.dlgImg(:src="currentTenant")
      el-button.dlgImg-footer(@click="download", type="primary") 下载小程序码
    home-form(ref="homeForm", :showAll="showAllCarousel", :serverNow="serverNow", :minPage="minPage", :loading="loading", @submit="save")
</template>

<script>
import * as CustomPageService from 'src/service/home_template/index'
import { getMinPageList, updateMinPage } from 'src/api/home-template'
import HomeForm from './Form'

export default {
  components: {
    HomeForm
  },
  data () {
    return {
      showAllCarousel: true,
      loading: false,
      serverNow: 0,
      qrcodeDialogVisible: false,
      qrcodeIcon: require('src/assets/image/qrcode.png'),
      minPage: {},
      currentTenant: 'https://f.meishi.51baibao.com/mp/3845ec1f-22b9-11e8-8da5-00163e0e26f2.jpeg'
    }
  },
  methods: {
    async getMinPageList () {
      try {
        this.loading = true
        const res = await getMinPageList(this.$tid)
        if (res.data) {
          this.minPage = CustomPageService.convertPageContentModelToForm(res.data.data || {})
          this.serverNow = res.data.now
          if (!this.minPage.items || this.minPage.items.length === 0) {
            await this.$nextTick()
            this.$refs.homeForm.emptyShowCategory()
          }
          await this.$nextTick()
          this.$refs.homeForm.setSaveDisabled(true)
        }
      } finally {
        this.loading = false
      }
    },
    async save (minPage) {
      try {
        this.loading = true
        const param = CustomPageService.convertHomePageFormToParam(minPage)
        await updateMinPage(this.$tid, param)
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.getMinPageList()
      } finally {
        this.loading = false
      }
    },
    download () {
      let link = document.createElement('a')
      link.href = this.currentTenant
      link.download = 'qrcode'
      link.click()
      this.dialogVisible = false
    }
  },
  mounted () {
    this.getMinPageList()
  }
}
</script>

<style lang="scss" scoped>
.title-content {
  display: flex;
  justify-content: space-between;
}
.qrcode {
  display: flex;
  align-items: center;
  img {
    margin-left: 5px;
    cursor: pointer;
  }
}
.dlgImg {
  margin-left: 48px;
  width: 150px;
  height: 150px;
}
.dlgImg-footer {
  margin-top: 10px;
  margin-left: 33px;
  width: 180px;
  height: 36px;
  font-size: 12px;
}
</style>
