import { UPDATE_ME } from '../types'

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
  sysRoles: state => {
    if (state.me && state.me.roles && state.me.roles.length > 0) {
      return state.me.roles
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
  }
}

export default {
  state,
  getters,
  mutations
}
