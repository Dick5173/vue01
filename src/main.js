// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'src/assets/image/svg/index'
import SvgIcon from 'src/ui/widget/svg-icon/Index'
import ElementUI from 'element-ui'
import VueLazyload from 'vue-lazyload'
import 'element-ui/lib/theme-chalk/index.css'
import 'src/config/index'
import ErrorPlugin from 'src/plugin/error/index'
import GlobalPlugin from 'src/plugin/global/index'
import FilterPlugin from './filter'
import 'babel-polyfill'
import RamdaPlugin from 'src/plugin/ramda/index'

Vue.$router = router
Vue.$store = store

Vue.component('svg-icon', SvgIcon)
Vue.use(ElementUI)
Vue.use(VueLazyload)
Vue.use(ErrorPlugin)
Vue.use(GlobalPlugin)
Vue.use(FilterPlugin)
Vue.use(RamdaPlugin)

Vue.config.productionTip = false
/* eslint-disable no-new */
const instance = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

Vue.$defaultInstance = instance
