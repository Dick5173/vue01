import { UPDATE_ME, UPDATE_SYS_ROLES } from '../types'
import Vue from 'vue'

const state = {
  me: null,
  roles: []
}

const getters = {
  isLogin: state => {
    if (state.me && state.me.id) {
      return true
    }
    return false
  },
  isSuper: state => {
    if (state.me && state.me.super) {
      return true
    } else {
      return false
    }
  },
  // sysRoles: state => {
  //   if (state.me && state.me.roles && state.me.roles.length > 0) {
  //     return state.me.roles
  //   }
  //   return []
  // },
  sysRoles: state => {
    if (state.roles && state.roles.length > 0) {
      return state.roles
    } else {
      const roles = JSON.parse(window.localStorage.getItem('UPDATE_SYS_ROLES') || '[]')
      if (roles && roles.length > 0) {
        Vue.$store.commit(UPDATE_SYS_ROLES, roles)
        return roles
      }
    }
    return []
  }
}

const mutations = {

  /**
   * 更新ME
   * @param state
   * @param me
   */
  [UPDATE_ME] (state, me) {
    state.me = me
    if (me && me.roles && me.roles.length > 0) {
      Vue.$store.commit(UPDATE_SYS_ROLES, me.roles)
    }
  },
  [UPDATE_SYS_ROLES] (state, roles) {
    if (roles && roles.length > 0) {
      window.localStorage.setItem('UPDATE_SYS_ROLES', JSON.stringify(roles))
    }
    state.roles = roles
  }
}

export default {
  state,
  getters,
  mutations
}
