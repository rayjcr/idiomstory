<template>
<div class="wrap flexColumn">
    <header>
        <!--<footers v-on:changeActiveIndex="changeView"></footers>-->
        <headers v-on:changeActiveIndex="changeView"></headers>
    </header>
    <div class="Container flexBox">
        <transition name='flod'>
            <component  :is="currentView" v-on:backHome="changeView"></component>
        </transition>
    </div>
    
</div>
</template>

<script>
import headers from '../components/headers.vue'
import allstory from '../components/allstory.vue'
import nolearnstory from '../components/nolearnstory.vue'
import learnedstory from '../components/learnedstory.vue'
// import page_4 from '../components/page_4.vue'
// import test from '../components/vuexTest.vue'


export default {
  name: 'home',
  data(){
      return {currentView:'allstory'}
     // return {currentView:'page_1'}
  },
  components:{    //这里是注册你所需要的组件的地方 上面import进来,这里注册
       headers,
       allstory,
       nolearnstory,
       learnedstory
  },
  methods:{
     changeView(num){
        switch(num){
            case 0 : this.currentView = "allstory"; break
            case 1 : 
            // if(!localStorage.userToken){
            //     window.location.href="http://weixin.91118.com/index.html?openid="+ localStorage.userWid+"&url="+escape(window.location.href);
            //     }else{
            // this.currentView = "nolearnstory"; 
            // }
            this.currentView = "nolearnstory"; 
            break
            case 2 : 
            // if(!localStorage.userToken){window.location.href="http://weixin.91118.com/index.html?openid="+ localStorage.userWid+"&url="+escape(window.location.href);
            // }else{
            //     this.currentView = "learnedstory";
            // }
            this.currentView = "learnedstory";
             break
        }
     } 
  }
}
</script>

<style scoped>
    .wrap{ width:100%; height:100%; overflow: hidden;}

    .Container{width:100%; height:100%; background:#e6e6e6;position: relative;}
    footer{width:100%; height:.9rem; position:relative;}
    

    .flod-enter-active{
        /*
        animation-name:zoomIn;  /这里要写个兼容UC的 -webkit- /
        animation-duration:.5s;
        */
        animation-name:fadeInRight;animation-duration:.5s;
    }

    .flod-leave-active{
        /*
        animation-name:fadeOut;animation-duration:1.2s;
        */
    }


    /*
    // .fade-enter-active, .fade-leave-active {
    //     transition: opacity .5s
    // }
    // .fade-enter, .fade-leave-active {
    //     opacity: 0
    // }
    */
</style>
