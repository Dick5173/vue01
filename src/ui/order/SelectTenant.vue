<template lang="pug">
  el-select(v-model="model", filterable, clearable, placeholder="店铺/ID")
    el-option(v-for="item in tenants", :key="item.id", :label="selectName(item)", :value="selectName(item)")
</template>

<script>
  import {getListAll} from 'src/api/tenant'

  export default {
    components: {},
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        modelValue: '',
        tenants: []
      }
    },
    watch: {
      value (val, old) {
        if (!old || old === '') {
          this.modelValue = val
        }
      }
    },
    computed: {
      model: {
        get () {
          return this.modelValue
        },
        set (val) {
          this.modelValue = val
          const id = this.modelValue.split(':')[0]
          this.$emit('input', id)
        }
      }
    },
    methods: {
      selectName (item) {
        if (!item.id || item.id === '') {
          return ''
        }
        return item.id + ': ' + item.nick_name
      },
      async loadTenants () {
        const tenantsRes = await getListAll()
        this.tenants = tenantsRes.data.data
        if (this.modelValue !== '') {
          const values = this.modelValue.split(':')
          if (values.length === 1) {
            let name = ''
            this.tenants.forEach(item => {
              if (item.id === parseInt(this.modelValue)) {
                name = item.nick_name
              }
            })
            this.modelValue += ': ' + name
          }
        }
      }
    },
    mounted () {
      this.loadTenants()
    }
  }
</script>

<style lang="scss" scoped>

</style>
