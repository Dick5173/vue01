<template lang="pug">
  div
    el-form(ref="frmSearch", :inline="true")
      el-form-item(label="")
        el-checkbox(v-model="formData.top") 置顶
      el-form-item(label="")
        el-radio-group(v-model="formData.status")
          el-radio-button(:label="0") 全部
          el-radio-button(:label="1") 已上架
          el-radio-button(:label="3") 缺货
          el-radio-button(:label="2") 已下架
      el-form-item(label="", prop="category_id")
        el-select(ref="fIselectCid", v-model="formData.category_id", placeholder="请选择分类", clearable)
          el-option-group(v-for!="parentItem in allCategories", :label="parentItem.name", :key="parentItem.id")
            el-option(v-for!="childItem in parentItem.children", :label="childItem.name", :value="`${childItem.id}`", :key="childItem.id")
      el-form-item(label="", prop="tags")
        el-select(ref="fIselectTags", v-model="formData.tags", placeholder="请选择标签", multiple)
          el-option-group(v-for="parentItem in allTags", :label="parentItem.name", :key="parentItem.id")
            el-option(v-for="childItem in parentItem.items", :label="childItem.name", :value="`${childItem.id}`", :key="childItem.id")
      el-form-item
        el-checkbox(v-model="supply_scope", @change="supplyChange") 定向供货
      el-form-item(label="上架:")
        date-picker(:defaultDate="defaultDate", @change = "changeDate")
      el-form-item(label="控价:")
        el-select(v-model="formData.control_price", placeholder="请选择", clearable)
          el-option(v-for="item in controlList", :label="item.label", :value="item.value", :key="item.value")
      el-form-item(label="")
        el-input(v-model.trim="formData.text", clearable, placeholder="商品名/编码")
      el-form-item(label="")
        el-input(v-model.trim="formData.id", clearable, placeholder="商品ID")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
      el-form-item
        el-button(@click="createExportTask") 导出商品
        el-button(@click="gotoListExportTask") 查看已导出
</template>
<script>
  import * as CategoryApi from 'src/api/category'
  import * as TagApi from 'src/api/tag'
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'
  import { allStatus, allControlPrice } from 'src/service/product/index'
  import { dateFormat } from 'src/util/format'

  export default {
    components: {
      DatePicker
    },
    props: {
      queryParams: {}
    },
    data () {
      return {
        // region query
        formData: {
          top: false,
          status: 0,
          category_id: '',
          start: 0,
          end: 0,
          text: '',
          tags: [],
          supply_scope_tp: 0,
          id: '',
          control_price: 0
        },
        supply_scope: false,
        // endregion
        initialData: null,
        allCategories: [],
        allTags: [],
        defaultDate: [],
        ...$global.$mapConst({
          controlList: allControlPrice.controlList
        })
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      initData () {
        this.initialData = this.R.clone(this.formData)
        this.getCategoryList()
        this.getTagsList()
      },
      async getTagsList () {
        const resTagsList = await TagApi.getTagGroup()
        this.allTags = resTagsList.data.data
      },
      async getCategoryList () {
        const resCategory = await CategoryApi.getList()
        this.allCategories = resCategory.data.data
      },
      changeDate (event) {
        if (event && event.length === 2) {
          this.formData.start = event[0].getTime()
          this.formData.end = event[1].getTime()
        } else {
          this.formData.start = 0
          this.formData.end = 0
        }
      },
      supplyChange () {
        this.formData.supply_scope_tp = this.supply_scope ? 2 : 0
      },
      handleSearch () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.defaultDate = []
        this.$emit('submit', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData = {
          top: this.queryParams.top,
          category_id: this.queryParams.category_id,
          status: this.queryParams.status,
          start: this.R_.parseDateTick(0, this.queryParams.start),
          end: this.R_.parseDateTick(0, this.queryParams.end),
          text: this.queryParams.text,
          tags: this.queryParams.tags,
          supply_scope_tp: this.queryParams.supply_scope_tp,
          id: this.queryParams.id,
          control_price: this.queryParams.control_price
        }
        this.supply_scope = this.queryParams.supply_scope_tp === 2
        if (this.formData.control_price === 0) {
          this.formData.control_price = ''
        }
        if (this.formData.start && this.formData.end) {
          this.defaultDate = [this.formData.start, this.formData.end]
        } else {
          this.defaultDate = []
        }
      },
      createExportTask () {
        const h = this.$createElement

        var data = []
        data.push(h('p', null, '商品类型：平台供货'))
        if (this.formData.top) {
          data.push(h('p', null, '是否置顶：置顶'))
        }
        if (this.formData.status === allStatus.all.value) {
          data.push(h('p', null, `商品状态：上架/下架/缺货`))
        } else if (this.formData.status === allStatus.up.value) {
          data.push(h('p', null, `商品状态：${allStatus.up.text}`))
        } else if (this.formData.status === allStatus.down.value) {
          data.push(h('p', null, `商品状态：${allStatus.down.text}`))
        } else if (this.formData.status === allStatus.stockout.value) {
          data.push(h('p', null, `商品状态：${allStatus.stockout.text}`))
        }
        if (this.formData.category_id) {
          const label = this.$refs.fIselectCid.selectedLabel
          data.push(h('p', null, `商品分类：${label}`))
        }
        if (this.formData.tags && this.formData.tags.length > 0) {
          const selecteds = this.$refs.fIselectTags.selected
          const tagNames = []
          this.R.forEach(item => {
            tagNames.push(item.label)
          })(selecteds || [])
          data.push(h('p', null, `商品标签：${tagNames.join('/')}`))
        }
        if (this.formData.supply_scope_tp) {
          data.push(h('p', null, '定向供货：是'))
        }
        if (this.formData.start && this.formData.end) {
          const start = dateFormat(this.formData.start, 'YYYY-MM-DD')
          const end = dateFormat(this.formData.end, 'YYYY-MM-DD')
          data.push(h('p', null, `上架时间：${start}~${end}`))
        }
        if (this.formData.text) {
          data.push(h('p', null, '商品名称/编码：' + this.formData.text))
        }
        if (this.formData.id) {
          data.push(h('p', null, '商品ID：' + this.formData.id))
        }
        this.$confirm(`确认导出`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          message: h('div', null, data)
        }).then(() => {
          const form = this.R.clone(this.formData)
          this.$emit('create_export_task', form)
        }).catch(() => { })
      },
      gotoListExportTask () {
        this.$router.push({
          name: 'exportTask',
          query: { tp: 2 }
        })
      }
    },
    async mounted () {
      this.initData()
      this.convertQueryParamsToForm()
    }
  }
</script>

<style lang="scss" scoped>
</style>
