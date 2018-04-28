<template lang="pug">
  div
    el-table(:data="dataList", border, cell-class-name="hidden-bottom-padding-el-tab")
      el-table-column(label="配送区域")
        template(slot-scope="props")
          div.show-margin-cell(v-if="props.$index === 0") 默认
          div(v-else)
            el-form-item.show-validate-in-tab-el-form(:ref="`province${props.$index}`", :prop="'items.' + props.$index + '.province'", :rules="formRules.province")
              div.province(@click="handleChooseProvince(props)") {{ showProvince(props.row) }}
      el-table-column(:label="isWeight ? '首件(Kg)' : '首件(个)'")
        template(slot-scope="props")
          el-form-item.show-validate-in-tab-el-form(:prop="'items.' + props.$index + '.first_unit'", :rules="formRules.first_unit")
            el-input(v-model.trim="props.row.first_unit" clearable)
      el-table-column(label="运费(元)")
        template(slot-scope="props")
          el-form-item.show-validate-in-tab-el-form(:prop="'items.' + props.$index + '.first_price'", :rules="formRules.first_price")
            el-input(v-model.trim="props.row.first_price" clearable)
      el-table-column(:label="isWeight ? '续件(Kg)' : '续件(个)'")
        template(slot-scope="props")
          el-form-item.show-validate-in-tab-el-form(:prop="'items.' + props.$index + '.next_unit'", :rules="formRules.next_unit")
            el-input(v-model.trim="props.row.next_unit" clearable)
      el-table-column(label="续费(元)")
        template(slot-scope="props")
          el-form-item.show-validate-in-tab-el-form(:prop="'items.' + props.$index + '.next_price'", :rules="formRules.next_price")
            el-input(v-model.trim="props.row.next_price" clearable)
      el-table-column(label="操作")
        div.show-margin-cell(slot-scope="props", v-if="props.$index !== 0")
          el-button(type="danger", size="small", plain, @click="handleDeleteItem(props.$index)") 删除
    div.add
      el-button(type="primary", size="small", plain, icon="el-icon-plus", @click="handleAddItem") 添加
    choose-province-dialog(ref="dlgChooseProvince", @submit="handleSubmit")
</template>

<script>
  import ChooseProvinceDialog from 'src/ui/common/choose-province-dialog'
  import * as FreightService from 'src/service/freight-template/index'
  import { priceValidator } from 'src/util/validator'

  export default {
    components: {
      ChooseProvinceDialog
    },
    props: {
      dataList: {
        type: Array,
        required: true
      },
      tp: {
        type: Number,
        required: true
      }
    },
    computed: {
      isWeight () {
        return this.tp === FreightService.allUnitTp.weight.value
      }
    },
    data () {
      const numValidator = (rule, value, callback) => {
        if (this.tp === FreightService.allUnitTp.piece.value) {
          if (!this.R_.isInteger(value)) {
            callback(new Error('请输入正整数'))
            return
          }
          const i = parseInt(value)
          if (i < 0) {
            callback(new Error('必须为正整数'))
            return
          }
        } else if (this.tp === FreightService.allUnitTp.weight.value) {
          let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1})?$)|(^(0){1}$)|(^[0-9]\.[0-9]$)/
          if (reg.test(value)) {
            if (parseFloat(value) <= 0) {
              callback(new Error('必须为正数'))
              return
            }
            callback()
          } else {
            callback(new Error('最多1位小数数字'))
            return
          }
        }
        callback()
      }
      return {
        formRules: {
          province: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          first_unit: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: numValidator, trigger: 'blur'}
          ],
          first_price: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: priceValidator, trigger: 'blur'}
          ],
          next_unit: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: numValidator, trigger: 'blur'}
          ],
          next_price: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: priceValidator, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleAddItem () {
        this.dataList.push({
          id: 0,
          province: [],
          first_unit: '',
          first_price: '',
          next_unit: '',
          next_price: ''
        })
      },
      handleDeleteItem (index) {
        this.dataList.splice(index, 1)
      },
      handleChooseProvince (props) {
        let disableItems = []
        for (const item of this.dataList) {
          if (item === props.row) {
            continue
          }
          if (item.province) {
            disableItems = disableItems.concat(item.province)
          }
        }
        this.$refs.dlgChooseProvince.show(props.row, props.$index, disableItems)
      },
      handleSubmit (row) {
        this.$refs[`province${row.index}`] && this.$refs[`province${row.index}`].validate('blur')
      },
      ...$global.$mapMethods({
        'showProvince': FreightService.showProvince
      })
    }
  }
</script>

<style lang="scss" scoped>
  .province {
    color: $color-primary;
    cursor: pointer;
    overflow-y: auto;
    max-height: 60px;
    line-height: 18px;
  }

  .show-margin-cell {
    margin-bottom: 20px;
  }
</style>
