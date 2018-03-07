<template lang="pug">
  el-form.large-el-form(ref="form", :model="formData", :rules="formRules", labelWidth="80px", v-loading="loading")
    el-form-item(label="模板名称", prop="name")
      el-input.small-el-input(v-model.trim="formData.name", :maxlength="20", placeholder="最多20个字")
    el-form-item(label="计费类型", prop="unit_tp")
      el-radio-group(v-model="formData.unit_tp", @change="handleUnitTpChange", :disabled="isEditMode")
        el-radio(v-for!="item in allUnitTp", :label="item.value", :key="item.value") {{ item.text }}
    el-form-item(label="", prop="items")
      items(:data-list="formData.items", :tp="formData.unit_tp")
    el-form-item
      el-button(@click="$router.back()") 取消
      el-button(type="primary", :loading="saving", @click="save") 确定
</template>

<script>
  import * as FormApi from 'src/api/freight-template'
  import * as FreightService from 'src/service/freight-template'
  import Items from './Items'

  export default {
    components: {
      Items
    },
    data () {
      return {
        loading: false,
        saving: false,
        initialData: {},
        formData: {
          id: 0,
          name: '',
          unit_tp: FreightService.allUnitTp.piece.value,
          items: [
            {
              id: 0,
              province: [],
              first_unit: '',
              first_price: '',
              next_unit: '',
              next_price: ''
            }
          ]
        },
        formRules: {
          name: [
            {
              required: true, message: '请输入名称', trigger: 'blur'
            },
            {
              max: 20, message: '最大20个字符', trigger: 'blur'
            }
          ]
        },
        ...$global.$mapConst({
          'allUnitTp': FreightService.allUnitTp
        })
      }
    },
    methods: {
      handleUnitTpChange () {
      },
      async initEditData () {
        if (this.isEditMode) {
          this.loading = true
          const resItem = await FormApi.getItem(this.$route.params.id)
          this.formData = FreightService.convertModelToForm(resItem.data)
          this.initialData = this.R.clone(this.formData)
          this.loading = false
        }
      },
      save () {
        this.$refs.form.validate(async (valid) => {
          this.saving = true
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
          this.saving = false
        })
      }
    },
    computed: {
      isEditMode () {
        return this.$route.name === 'FreightEdit'
      }
    },
    async mounted () {
      this.initEditData()
    }
  }
</script>

<style lang="scss" scoped>
</style>
