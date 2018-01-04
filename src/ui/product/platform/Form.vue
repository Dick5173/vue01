<template lang="pug">
  el-form(ref="form", :model="formData", :rules="formRules", labelWidth="70px")
    el-form-item(label="商品图片", prop="head")
      upload-image-list(:imageList.sync="formData.head")
    el-form-item(label="列表图", prop="cover")
      upload-image(:image.sync="formData.cover")
    el-form-item(label="商品名称", prop="name")
      el-input.medium-el-input(v-model="formData.name", :maxlength="50")
      span.input-text-count {{ formData.name.length }} / 50
    el-form-item(label="卖点", prop="sell_point")
      el-input.medium-el-input(v-model="formData.sell_point", :maxlength="50")
      span.input-text-count {{ formData.sell_point.length }} / 50
    el-form-item(label="商品规格", prop="skus")
      skus(:skus.sync="formData.skus")
    el-form-item(label="划线价", prop="st_price")
      el-input.tiny-el-input(v-model="formData.st_price")
    el-form-item(label="供货价", prop="supply_price")
      el-input.tiny-el-input(v-model="formData.supply_price")
    el-form-item(label="商品分类", prop="category_id")
      el-select(v-model="formData.category_id", placeholder="请选择")
        el-option-group(v-for!="parentItem in allCategories", :label="parentItem.name", :key="parentItem.id")
          el-option(v-for!="childItem in parentItem.children", :label="childItem.name", :value="`${childItem.id}`", :key="childItem.id")
    el-form-item(label="商品描述", prop="content")
      content-comp(:content.sync="formData.content")
    el-form-item
      el-button(@click="$router.back()") 取消
      el-button(type="primary", :loading="loading", @click="save") 确定
</template>

<script>
  import UploadImageList from 'src/ui/widget/upload-image-list/Index.vue'
  import UploadImage from 'src/ui/widget/upload-image/Index.vue'
  import Skus from './Skus.vue'
  import ContentComp from './Content.vue'
  import * as FormApi from 'src/api/product'
  import * as CategoryApi from 'src/api/category'

  export default {
    components: {
      UploadImageList,
      UploadImage,
      Skus,
      ContentComp
    },
    data () {
      return {
        loading: false,
        initialData: {},
        formData: {
          id: 0,
          head: [],
          cover: {
            url: '',
            width: 0,
            height: 0
          },
          name: '',
          sell_point: '',
          skus: [],
          st_price: '',
          supply_price: '',
          category_id: '',
          content: []
        },
        formRules: {},
        allCategories: []
      }
    },
    methods: {
      async initData () {
        const resCategory = await CategoryApi.getList()
        this.allCategories = resCategory.data.data
        if (this.isEditMode) {
          const resItem = await FormApi.getItem(this.$route.params.id)
          this.formData = resItem.data
        }
        this.initialData = this.R.clone(this.formData)
      },
      save () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              if (!this.isEditMode) {
                await FormApi.create(this.formData)
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              } else {
                await FormApi.update(this.formData.id, this.formData)
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
              }
              this.$router.back()
            } catch (err) {
            }
          }
        })
        this.loading = false
      }
    },
    computed: {
      isEditMode () {
        return this.$route.name === 'PlatformProductEdit'
      }
    },
    async mounted () {
      this.initData()
    }
  }
</script>

<style lang="scss" scoped>
</style>
