<template lang="pug">
  div
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="78px", v-loading="loading")
      el-form-item(label="名称", prop="name")
        el-input.small-el-input(v-model.trim="formData.name", clearable, placeholder="最多10个字", :maxlength="10")
      el-form-item(label="内容", prop="items")
        content-comp(:content.sync="formData.items")
      el-form-item(style="margin-top: 50px;")
        el-button(@click="$router.back()") 取 消
        el-button(type="primary", @click="submit") 确 定
</template>

<script>
  import ContentComp from './Content.vue'
  import * as AfterServiceApi from 'src/api/after-service'
  import * as ElUtil from 'src/util/el'

  export default {
    props: {},
    components: {
      ContentComp
    },
    data () {
      const contentValidator = (rule, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error('请填写内容'))
          return
        }
        callback()
      }
      return {
        loading: false,
        formData: {
          id: 0,
          name: '',
          items: []
        },
        formRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {max: 10, message: '最大10个字符', trigger: 'blur'}
          ],
          items: [
            {required: true, validator: contentValidator, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      isEditMode () {
        return this.$route.name === 'AfterServiceEdit'
      }
    },
    watch: {},
    methods: {
      submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              if (this.isEditMode) {
                this.update()
              } else {
                this.create()
              }
            } catch (err) {
              // console.log(err)
            }
          } else {
            ElUtil.scrollToInvalidFirstElement(this.$refs.form)
          }
        })
      },
      async update () {
        try {
          this.loading = true
          await AfterServiceApi.editItem(this.formData)
          this.loading = false
          this.$router.back()
        } catch (err) {
          this.loading = false
        }
      },
      async create () {
        try {
          this.loading = true
          await AfterServiceApi.createItem(this.formData)
          this.loading = false
          this.$router.back()
        } catch (err) {
          this.loading = false
        }
      },
      async getEditItem () {
        if (this.isEditMode) {
          try {
            this.loading = true
            let res = await AfterServiceApi.getEditItem(this.$route.params.id)
            this.formData = res.data
            this.loading = false
          } catch (err) {
            this.loading = false
          }
        }
      }
    },
    mounted () {
      this.getEditItem()
    }
  }
</script>


<style lang="scss" scoped>

</style>
