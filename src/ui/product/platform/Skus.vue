<template lang="pug">
  div
    smart-table.large-el-table(ref="skuTable", :dataList="skus", @drag-change="handleDragChange",  @drag-end="handleDragEnd")
      table-column(type="drag")
      table-column(label="规格")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`spec{props.index}`", :prop="'skus.' + props.index + '.spec'", :rules="formRules.spec")
            el-input(v-model.trim="props.row.spec")
      table-column(label="建议售价")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`suggest_price${props.index}`", :prop="'skus.' + props.index + '.suggest_price'", :rules="formRules.suggest_price")
            el-input(v-model.trim="props.row.suggest_price")
      table-column(label="库存")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`stock${props.index}`", :prop="'skus.' + props.index + '.stock'", :rules="formRules.stock")
            el-input(v-model.trim="props.row.stock")
      table-column(label="编码")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`code${props.index}`", :prop="'skus.' + props.index + '.code'", :rules="formRules.code")
            el-input(v-model.trim="props.row.code")
      table-column(label="图片", width="80px")
        div(slot-scope="props")
          el-form-item.show-validate-el-form(:ref="`image${props.index}`", :prop="'skus.' + props.index + '.image'", :rules="formRules.image")
            upload-image(:image.sync="props.row.image", size="50px", addIconSize="20px")
      table-column(label="", width="80px")
        div(slot-scope="props")
          el-button(type="danger", size="mini", plain, @click="handleDelSku(props.index)") 删除
    div
      el-button(type="primary", size="mini", plain, @click="handleAddSku") 添加商品规格
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import SmartTable from 'src/ui/widget/smart-table/Table.vue'
  import TableColumn from 'src/ui/widget/smart-table/TableColumn.jsx'
  import UploadImage from 'src/ui/widget/upload-image/Index.vue'

  export default {
    mixins: [emitter],
    components: {
      SmartTable,
      TableColumn,
      UploadImage
    },
    props: {
      skus: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        formRules: {
          spec: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          suggest_price: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          stock: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleDragChange (dataList) {
        this.$emit('update:skus', arguments[0])
        this.dispatch('ElFormItem', 'el.form.change', [dataList])
      },
      async handleDragEnd () {
        await this.$nextTick()
        for (const i in this.skus) {
          const item = this.skus[i]
          Object.keys(item).forEach(async (k) => {
            await this.$nextTick()
            this.$refs[`${k}${i}`] && this.$refs[`${k}${i}`].clearValidate()
          })
        }
      },
      handleAddSku () {
        this.skus.push(
          {
            spec: '',
            suggest_price: '',
            stock: '',
            code: '',
            image: {
              url: '',
              width: 0,
              height: 0
            }
          }
        )
      },
      handleDelSku (index) {
        this.skus.splice(index, 1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .skus-table {
    width: 700px;
  }
</style>
