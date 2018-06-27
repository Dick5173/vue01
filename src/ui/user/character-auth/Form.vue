<template lang="pug">
  div(v-loading="loading")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="80px")
      el-form-item(label="名称：", prop="name")
        el-input.tiny-x-el-input(v-model.trim="formData.name", :maxlength="10")
      el-form-item(label="描述：")
        el-input.small-el-input(v-model.trim="formData.description", :maxlength="20")
      el-form-item(label="权限：")
        el-checkbox-group(v-model="checkAuths")
          div(v-for="item in AuthList")
            div(v-if="isHasChildren(item)")
              div.title(v-if="showName(item)") {{showName(item)}}
              div.child-auth
                div(v-for="child in item.children")
                  el-checkbox(:label="checkParentLabel(child.id)", :indeterminate="isIndeterminate(child)") {{child.name}}
                  div.child-auth(v-show="showChild(child)")
                    div.checkbox(v-for="auth in child.auths")
                      el-checkbox(:label="auth.id") {{auth.name}}
            div(v-else)
              el-checkbox(:label="checkParentLabel(item.id)", :indeterminate="isIndeterminate(item)") {{item.name}}
              div.child-auth(v-show="showChild(item)")
                div.checkbox(v-for="auth in item.auths")
                  el-checkbox(:label="auth.id") {{auth.name}}
      el-form-item()
        el-button(@click="$router.back()") 取消
        el-button(@click="submit", type="primary") 提交
</template>

<script>
  import * as CharacterAuthApi from 'src/api/character-auth'
  import Vue from 'vue'

  export default {
    props: {},
    components: {},
    data () {
      const nameValidator = (rule, value, callback) => {
        if (value === '超级管理员') {
          callback(new Error('角色名称不能命名为超级管理员'))
          return
        }
        callback()
      }
      return {
        loading: false,
        AuthList: [],
        allChildrenList: [],
        formData: {
          id: 0,
          name: '',
          description: '',
          auths: []
        },
        formRules: {
          name: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 10, message: '名称最长10个字符', trigger: 'blur'},
            {validator: nameValidator, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      checkAuths: {
        get () {
          return this.formData.auths
        },
        set (newValue) {
          let diff = []
          if (newValue.length > this.formData.auths.length) {
            diff = this.R.difference(newValue)(this.formData.auths)
          } else {
            diff = this.R.difference(this.formData.auths)(newValue)
          }
          this.formData.auths = newValue
          this.R.forEach(item => {
            if (item.constructor === String) {
              this.editChild(item)
            } else {
              this.editAuth(newValue)
            }
          })(diff || [])
        }
      },
      isEdit () {
        return this.$route.name === 'EditCharacter'
      },
      allChildIds () {
        return this.R.map(item => item.id)(this.allChildrenList || [])
      },
      allCheckIds () {
        const ids = Object()
        this.R.forEach((child) => {
          if (!ids[child.id]) {
            ids[child.id] = []
          }
          ids[child.id].push(...this.getAuthItemIds(child.auths))
        })(this.allChildrenList || [])
        return ids
      }
    },
    methods: {
      checkParentLabel (id) {
        return `gid-${id}`
      },
      getAuthItemIds (items) {
        return this.R.map(item => item.id)(items || [])
      },
      editChild (label) {
        const parentId = parseInt(label.split('-')[1])
        const parentIndex = this.R.findIndex(id => id === parentId)(this.allChildIds || [])
        if (parentIndex === -1) {
          return
        }
        const parent = this.allChildrenList[parentIndex]
        parent.indeterminate = false
        Vue.set(this.allChildrenList, parentIndex, parent)
        const index = this.R.findIndex((item) => item === label)(this.formData.auths || [])
        if (index === -1) {
          const ids = [label, ...this.getAuthItemIds(parent.auths)]
          this.formData.auths = this.R.without(ids)(this.formData.auths)
        } else {
          const diff = this.R.difference(this.getAuthItemIds(parent.auths))(this.formData.auths || [])
          this.formData.auths.push(...diff)
        }
      },
      editAuth (newValue) {
        this.R.forEachObjIndexed((items, key) => {
          const diff = this.R.difference(items || [])(newValue || [])
          const childIndex = this.R.findIndex(childId => childId === parseInt(key))(this.allChildIds || [])
          childIndex > -1 && (this.allChildrenList[childIndex].indeterminate = items && items.length > 0 && diff && diff.length > 0 && diff.length < items.length)
          if (items && items.length > 0 && (!diff || diff.length === 0)) {
            const index = this.R.findIndex(item => item === this.checkParentLabel(key))(this.formData.auths || [])
            index === -1 && this.formData.auths.push(this.checkParentLabel(key))
          } else {
            const index = this.R.findIndex(item => item === this.checkParentLabel(key))(this.formData.auths || [])
            index > -1 && this.formData.auths.splice(index, 1)
          }
        })(this.allCheckIds || [])
      },
      setAllChildrenList () {
        let items = []
        this.R.forEach((parent) => {
          if (parent.children && parent.children.length > 0) {
            items.push(...parent.children)
          } else {
            items.push(parent)
          }
        })(this.AuthList || [])
        this.allChildrenList = items
      },
      isHasChildren (item) {
        return item.children && item.children.length > 0
      },
      isIndeterminate (item) {
        const child = this.R.find(child => child.id === item.id)(this.allChildrenList || [])
        if (child) {
          return child.indeterminate
        }
        return false
      },
      showChild (item) {
        if (!item.auths || item.auths.length === 0) {
          return false
        }
        // s_tp 1:一般 2:其他
        if (item.auths.length === 1 && item.auths[0].s_tp === 2) {
          return false
        }
        return true
      },
      showName (item) {
        if (this.isHasChildren(item)) {
          return item.name
        }
        return null
      },
      submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              if (this.isEdit) {
                await CharacterAuthApi.editTenantRole(this.formData)
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                this.$router.back()
              } else {
                await CharacterAuthApi.createTenantRole(this.formData)
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.$router.back()
              }
            } finally {
              this.loading = false
            }
          }
        })
      },
      async getRole () {
        if (this.isEdit) {
          this.loading = true
          try {
            let res = await CharacterAuthApi.getTenantRoleItem(this.$route.params.id)
            this.formData = res.data.data
            if (this.formData.auths) {
              this.formData.auths = res.data.data.auths.map(i => {
                return i.id
              })
            } else {
              this.formData.auths = []
            }
            console.log(this.formData)
            this.editAuth(this.formData.auths)
          } finally {
            this.loading = false
          }
        }
      },
      async getAuthList () {
        this.loading = true
        try {
          let res = await CharacterAuthApi.getAuthGroup()
          this.AuthList = res.data.data
          this.setAllChildrenList()
        } finally {
          this.loading = false
        }
      }
    },
    async mounted () {
      await this.getAuthList()
      await this.getRole()
    }
  }
</script>


<style lang="scss" scoped>
  .title {
    font-size: 12px;
    color: #909399;
  }

  .checkbox {
    display: inline-block;
    margin-right: 20px;
  }

  .child-auth {
    margin-left: 20px;
  }
</style>
