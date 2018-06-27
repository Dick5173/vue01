<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item()
        el-select(v-model="formData.role", placeholder="请选择角色", multiple)
          el-option(v-for="item in roleList", :key="item.id", :label="item.name", :value="item.id")
      el-form-item()
        el-input.tiny-x-el-input(v-model="formData.text", placeholder="名字/手机号", clearable)
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜索
        el-button(@click="handleReset") 重置
</template>

<script>
  import * as CharacterAuthApi from 'src/api/character-auth'

  export default {
    components: {},
    props: {
      queryParams: {}
    },
    data () {
      return {
        // region query
        roleList: [],
        formData: {
          text: '',
          role: []
        },
        // endregion
        initialData: null
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      async getRoleList () {
        this.loading = true
        try {
          let res = await CharacterAuthApi.getTenantRoleList()
          this.roleList = res.data.data
        } finally {
          this.loading = false
        }
      },
      async initData () {
        this.initialData = this.R.clone(this.formData)
        this.getRoleList()
      },
      handleSearch () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.$emit('submit', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData = this.R_.updateWithObj(this.formData, this.queryParams)
      }
    },
    async mounted () {
      await this.initData()
      this.convertQueryParamsToForm()
    }
  }
</script>

<style lang="scss" scoped>
</style>
