import Vue from 'vue'
import App from './App'
import Version from './common/version.js'

Vue.config.productionTip = false
Vue.prototype.Version = Version 

App.mpType = 'app'

const app = new Vue({
		Version,
    ...App
})
app.$mount()
