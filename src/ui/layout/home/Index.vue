<template lang="pug">
  div
    div.top-wrapper
      div 百宝美市管理后台
      div
        el-dropdown(@command="handleMenuCommand")
          span.dropdown-link
            | {{ profileName }}
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(command="password") 修改密码
            el-dropdown-item(command="logout") 退出登录
    div.side-wrapper
      side.side-content
    div.body-wrapper
      div
        div#app-content.content-wrapper
          div.breadcrumb-wrapper
            div
              el-breadcrumb(v-if="showBreadcrumb")
                template(v-for!="item in breadcrumbItems")
                  el-breadcrumb-item(:to="item.to", :replace="!!item.replace") {{ item.text }}
          div.mid-wrapper
            router-view
    change-password-dialog(ref="dlgChangePassword")
</template>

<script>
  import Side from 'src/ui/layout/home/Side'
  import ChangePasswordDialog from 'src/ui/user/change-password/Index.vue'
  import { mapState } from 'vuex'
  import * as AuthApi from 'src/api/auth'

  export default {
    components: {
      Side,
      ChangePasswordDialog
    },
    data () {
      return {
        showBreadcrumb: true,
        breadcrumbItems: []
      }
    },
    methods: {
      async autoUpdateBreadcrumb () {
        if (!this.$route.meta.customBreadcrumb) {
          if (this.$route.meta.breadcrumbItems) {
            this.updateBreadcrumb(this.$route.meta.breadcrumbItems)
          } else {
            this.updateBreadcrumb([{
              text: this.$route.meta.title ? this.$route.meta.title : this.$route.name
            }])
          }
        }
      },
      async updateBreadcrumb (breadcrumbItems) {
        this.breadcrumbItems = breadcrumbItems
        this.showBreadcrumb = false
        await this.$nextTick()
        this.showBreadcrumb = true
      },
      handleMenuCommand (command) {
        switch (command) {
          case 'password':
            this.$refs.dlgChangePassword.show()
            break
          case 'logout':
            this.logout()
        }
      },
      async logout () {
        await AuthApi.logout()
        this.$router.replace({
          name: 'Login'
        })
      },
      getContentRoot () {
        return this.$refs.contentRoot
      }
    },
    computed: {
      ...mapState({
        profileName: state => state.auth.me ? state.auth.me.name : ''
      })
    },
    watch: {
      $route () {
        this.autoUpdateBreadcrumb()
      }
    },
    created () {
      this.autoUpdateBreadcrumb()
    }
  }
</script>

<style lang="scss" scoped>
  $content-padding: 16px;
  $header-height: 60px;

  .top-wrapper {
    position: fixed;
    display: flex;
    align-items: center;
    height: $header-height;
    width: 100%;
    background: $color-primary;
    box-sizing: border-box;
    z-index: 1;

    .dropdown-link {
      cursor: pointer;
      color: #ffffff;
    }

    & > :nth-child(1) {
      flex: 1;
      padding-left: $content-padding;
      color: $border-color-level4;
      font-weight: bold;
    }

    & > :nth-child(2) {
      width: 200px;
      text-align: right;
      padding-right: $content-padding;
    }

  }

  .side-wrapper {
    position: fixed;
    top: $header-height;
    left: 0;
    bottom: 0;
    overflow-x: hidden;
    width: $side-width;
    z-index: 100;

    .side-content {
      transition: all .28s ease-out;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: -17px;
      overflow-x: hidden;
      overflow-y: scroll;
    }

  }

  .breadcrumb-wrapper {
    height: $header-height;
    overflow: hidden;
    background-color: #eef1f6;
    display: flex;
    align-items: center;
    padding-left: $content-padding;
    padding-right: $content-padding;

    & > :nth-child(1) {
      flex: 1;
    }
  }

  .body-wrapper {
    position: absolute;
    width: 100%;
    top: $header-height;
    bottom: 0;

    & > div {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
      width: auto;
      background: #ffffff;
    }

    .content-wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: auto;
      left: $side-width;

      overflow-y: auto;
    }

    .mid-wrapper {
      padding: $content-padding;
    }

  }

</style>
