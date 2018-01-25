<template lang="pug">
  el-select(v-model="model" filterable placeholder="请选择")
    el-option(v-for="item in tenants", :key="item.id", :label="item.nick_name", :value="item.id")
</template>

<script>
  export default {
    components: {},
    props: {
      value: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        modelValue: 0,
        tenants: [
          {
            id: 1,
            nick_name: 'a'
          },
          {
            id: 2,
            nick_name: 'b'
          },
          {
            id: 3,
            nick_name: 'ab'
          },
          {
            id: 4,
            nick_name: 'ac'
          },
          {
            id: 5,
            nick_name: 'c'
          }
        ]
      }
    },
    watch: {
      value (val) {
        this.modelValue = val
      }
    },
    computed: {
      model: {
        get () {
          return this.modelValue
        },
        set (val) {
          this.modelValue = val
          this.$emit('input', val)
        }
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

</style>
