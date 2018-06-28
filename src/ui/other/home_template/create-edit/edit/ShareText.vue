<template lang="pug">
  div.share-content
    left-arrow
    div.info-content
      div.share-text 标题：{{formData.name}}
</template>

<script>
  import LeftArrow from '../view/LeftArrow'
  import * as CustomPageService from 'src/service/home_template/index'
  import * as ElUtil from 'src/util/el'

  export default {
    components: {
      LeftArrow
    },
    props: {
      queryParams: {
        type: Object,
        default () {
          return {}
        },
        required: true
      }
    },
    watch: {
      queryParams (val) {
        this.formData = val
      },
      formData: {
        handler (val) {
          this.$emit('update:queryParams', val)
        },
        deep: true
      }
    },
    data () {
      const nameValidator = (rule, value, callback) => {
        if (this.queryParams.tp === CustomPageService.allPageTp.min.value && (!value || value === '')) {
          callback(new Error('不能为空'))
          return
        }
        callback()
      }
      return {
        formData: this.queryParams,
        formRules: {
          name: [
            {validator: nameValidator, trigger: 'blur, change'}
          ]
        },
        ...$global.$mapConst({
          'allPageTp': CustomPageService.allPageTp
        })
      }
    },
    computed: {},
    methods: {
      formValidate () {
        this.$refs.form.validate(async (valid) => {
          if (!valid) {
            ElUtil.scrollToInvalidFirstElement(this.$refs.form)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .share-content {
    width: 542px;
    margin-bottom: 10px;
    display: flex;

    .info-content {
      color: $home-color-common;
      font-size: $home-size-title;
      flex: 1;
      width: 100%;
      height: 100%;
      padding: 15px;
      border: 1px solid #DFDFDF;
      position: relative;
      background: #F5F5F5;
      line-height: 40px;
      border-radius: 10px;

      &:after {
        position: absolute;
        content: '';
        width: 20px;
        height: 20px;
        background: #F5F5F5;
        border-top-right-radius: 10px;
        top: 25px;
        left: -11px;
        border-bottom: solid 1px #DFDFDF;
        border-right: solid 1px #F5F5F5;
        border-top: solid 1px #F5F5F5;
        border-left: solid 1px #DFDFDF;
        transform: rotate(45deg);
      }

      .share-text {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
