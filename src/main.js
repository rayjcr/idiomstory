import polyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'      //vue路由插件
import VueResource from 'vue-resource'  //vue资源插件
import store from './vuex/store'


//import $ from 'jquery' 

//各种组件模版
//import app from './App.vue'
import blank from './components/blank.vue'
import home from './components/home.vue'
import search from './components/search.vue'
import favorite from './components/favorite.vue'
import play from './components/play.vue' 
import playmb from './components/playmb.vue' 


Vue.use(VueRouter);
Vue.use(VueResource);

// Vue.http.options.emulateJSON = true;
// Vue.http.options.headers = {
//   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
// };

// Vue.http.interceptors.push((request, next) => {
//   console.log("aaa");
//   request.headers['Authorization'] = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
//   request.headers['Accept'] = 'application/json'
//   console.log(request);
//   next()
// })

const routes = [  
  {path: '/', component: blank},  
  {path: '/home', component: home},      //这里是为了让输入错误路径和空路径时默认显示home的内容  
  {path: '/search', component: search},
  {path: '/favorite', component: favorite},
  {path: '/play', component: play},
  {path: '/playmb', component: playmb }
];  


// 声明一个路由对象                        
const router = new VueRouter({
  //mode: 'history',
  routes
})

router.beforeEach((to, from, next) => { 
  if(to.path=="/favorite"||to.path=="/play")
  {   
    if(!localStorage.userToken)
    {
      window.location.href="http://weixin.91118.com/index.html?openid="+ localStorage.userWid+"&url="+escape(window.location.href);
    }else{
next();
    }
  } else{
    next();
  }
  
})


new Vue({
  store,
  router,
  el: '#app',                           // 挂载点，挂载在id为appx的组件上  
  template: '<App/>',                   // 模版名称
  components: { App }
})
