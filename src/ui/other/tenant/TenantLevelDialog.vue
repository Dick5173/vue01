<template lang="pug">
  div
    el-dialog( title="店铺等级",
    :visible.sync="dialogVisible",
    width="400px")
      div.head
        div.img(v-lazy:background-image="tenantData.head_img")
        div.name {{tenantData.nick_name}}
      el-form.small-el-form(ref="form", :model="formData")
        el-radio-group(v-model="level", style="margin-left: 50px;margin-Bottom: 30px;margin-top: 30px")
          el-radio(v-for!="item in tenantLevelList", :label="item.id", :key="item.id") {{ item.description }}
        el-form-item
          el-button(type="", @click="hide", plain) 取 消
          el-button(type="primary", @click="handleTenantLevelChange") 确 定
</template>

<script>
  import * as TenantApi from 'src/api/tenant'

  export default {
    props: {},
    components: {},
    data () {
      return {
        dialogVisible: false,
        tenantData: {},
        level: '',
        formData: {
          id: '',
          level: ''
        },
        rules: {},
        tenantLevelList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      show (row) {
        this.reset()
        this.tenantData = row
        this.getTenantLevel()
        this.level = row.tenant_level.id
        this.dialogVisible = true
      },
      async getTenantLevel () {
        const res = await TenantApi.getTenantLevelList()
        this.tenantLevelList = res.data.data
      },
      hide () {
        this.dialogVisible = false
      },
      reset () {
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
        this.formData = {
          id: '',
          level: ''
        }
      },
      handleTenantLevelChange () {
        var tips = '修改店铺等级?'
        this.$confirm(tips, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            var formData = {
              level: this.level
            }
            await TenantApi.updateTenantLevel(this.tenantData.id, formData)
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.dialogVisible = false
            this.$emit('refresh')
          } catch (err) {}
        }).catch(() => {
          this.level = !this.level
        })
      }
    },
    mounted () {

    }

  }
</script>


<style lang="scss" scoped>
  .head {
    display: flex;
    height: 50px;
    .img {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center;
    }
    .name {
      display: inline-block;
      height: 50px;
      line-height: 50px;
      margin-left: 10px;
    }
  }

</style>
