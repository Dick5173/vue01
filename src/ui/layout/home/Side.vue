<template lang="pug">
  el-menu(mode="vertical", :default-active="$route.path" router)
    template(v-for!="menuItem in menus")
      el-submenu(:index="menuItem.name" v-if!="menuItem.isGroup", v-show="showSubmenu(menuItem)")
        template(slot="title") {{ menuItem.title }}
        template(v-for!="childItem in menuItem.items")
          el-menu-item(:index!="fullPath(menuItem, childItem)", v-show="showMenu(childItem)") {{ childItem.meta.title }}
      el-menu-item(v-else :index="menuItem.path", v-show="showMenu(menuItem)") {{ menuItem.meta.title }}
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getRolesInterNames, canUseRolesNames } from 'src/service/auth/index'

  export default {
    computed: {
      menus () {
        const menus = []
        const homeRoute = this.$router.options.routes.find((item) => {
          return item.meta.menu === true
        })
        if (homeRoute) {
          let currentGroup = null
          for (let item of homeRoute.children) {
            if (!item.meta || !item.meta.showInSide) {
              continue
            }
            const currentGroupName = currentGroup ? currentGroup.name : null
            if (!item.meta.group && currentGroupName) {
              currentGroup = null
            } else {
              if (item.meta.group && item.meta.group !== currentGroupName) {
                currentGroup = homeRoute.meta.groups.find(groupItem => {
                  return groupItem.name === item.meta.group
                })
                currentGroup.items = []
                currentGroup.isGroup = true
                menus.push(currentGroup)
              }
            }
            if (!currentGroup) {
              menus.push(item)
            } else {
              currentGroup.items.push(item)
            }
          }
        }
        return menus
      },
      ...mapGetters(['sysRoles', 'isSuper', 'allRoles'])
    },
    methods: {
      showSubmenu (item) {
        if (this.isSuper) {
          return true
        }
        const interNames = getRolesInterNames(this.sysRoles, this.allRoles)
        const canUseInterNames = canUseRolesNames(interNames, item.items)
        return canUseInterNames.length > 0
      },
      showMenu (item) {
        if (this.isSuper) {
          return true
        }
        const interNames = getRolesInterNames(this.sysRoles, this.allRoles)
        let index = this.R.findIndex(name => name === item.meta.title)(interNames)
        return index !== -1
      },
      fullPath (menuItem, childItem) {
        return `${menuItem.path}${childItem.path}`
      }
    }
  }
</script>

<style lang="scss">
  .el-menu {
    min-height: 100%;
  }
</style>

