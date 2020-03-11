import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index.js';
import 'reset-css';
import vuescroll from 'vuescroll';
import Icon from './base/icon/icon.vue';
// import { HappyScroll } from 'vue-happy-scroll'
// import 'vue-happy-scroll/docs/happy-scroll.css';
Vue.config.productionTip = false;
Vue.use(vuescroll);
// Vue.use(Icon);
Vue.component('icon', Icon);
Vue.component('vue-scroll', vuescroll);
//删除node_modules文件的命令    rimraf node_modules
var vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
// console.log(vm);
// var id = 1363948882;
// `http://api.mtnhao.com/lyric?id=${id}`
// `http://music.163.com/song/media/outer/url?id=${id}.mp3`