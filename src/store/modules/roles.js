import { UPDATE_ROLES } from '../types'

const state = {
  roles: []
}

const getters = {
  allRoles: state => {
    if (state.roles && state.roles.length > 0) {
      return state.roles
    }
    return []
  }
}

const mutations = {
  [UPDATE_ROLES] (state, roles) {
    state.roles = roles
  }
}

export default {
  state,
  getters,
  mutations
}
