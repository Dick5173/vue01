<template lang="pug">
  div
    tenant-user-form(:mode="1")
</template>

<script>
  import tenantUserForm from 'src/ui/user/tenant-user/form.vue'

  export default {
    props: {},
    components: {tenantUserForm},
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {}
  }
</script>


<style lang="scss" scoped>

</style>
