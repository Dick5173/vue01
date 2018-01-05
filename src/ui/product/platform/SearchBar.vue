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
        el-select(v-model="formData.category_id", placeholder="请选择分类")
          el-option-group(v-for!="parentItem in allCategories", :label="parentItem.name", :key="parentItem.id")
            el-option(v-for!="childItem in parentItem.children", :label="childItem.name", :value="`${childItem.id}`", :key="childItem.id")
      el-form-item(label="上架:")
        date-picker(:defaultDate="defaultDate", @change = "changeDate")
      el-form-item(label="")
        el-input(v-model="formData.text", placeholder="商品名/ID/编码")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  import * as CategoryApi from 'src/api/category'
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'

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
          text: ''
        },
        // endregion
        initialData: null,
        allCategories: [],
        defaultDate: []
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      async initData () {
        this.initialData = this.R.clone(this.formData)
        const resCategory = await CategoryApi.getList()
        this.allCategories = resCategory.data.data
      },
      changeDate (event) {
        if (event && event.length === 2) {
          this.form.start = event[0].getTime()
          this.form.end = event[1].getTime()
        } else {
          this.form.start = 0
          this.form.end = 0
        }
      },
      handleSearch () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.defaultDate = []
      },
      convertQueryParamsToForm () {
        this.form = {
          top: this.queryParams.top,
          category_id: this.queryParams.category_id,
          status: parseInt(this.queryParams.status),
          start: this.R_.parseDateTick(0, this.queryParams.start ? this.queryParams.start.replace(/-/, '/') : ''),
          end: this.R_.parseDateTick(0, this.queryParams.end ? this.queryParams.end.replace(/-/, '/') : ''),
          text: this.queryParams.text
        }
        if (this.form.start && this.form.end) {
          this.defaultDate = [this.form.start, this.form.end]
        } else {
          this.defaultDate = []
        }
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
