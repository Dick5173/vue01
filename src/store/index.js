import Vuex from 'vuex'
import Vue from 'vue'
import { isDebug } from 'src/util/env'
import createLogger from 'vuex/dist/logger'
import auth from './modules/auth'
import roles from './modules/roles'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    roles
  },
  strict: isDebug,
  plugins: isDebug ? [createLogger()] : []
})
