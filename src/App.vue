<template>
  <div id="app">
    <!-- 单页开发所有内容经过路由都会渲染到这里router-view -->
    <transition name='flod'>
      <router-view>
      </router-view>
    </transition>
    <div v-show="isTips" class="tipsBox">
      <transition name='tips'>
            <div v-show="isTips" class="hDialog">{{tipsTxt}}</div>
      </transition>
    </div>
    <div v-show="isTips" class="maskTm"></div>

    <transition name='tips'>
        <div v-show="isplay" class="detailBox">
            <div class="detailHeader">
                <div class="PlayBack" v-on:click="CloseDetail"></div>
            </div>
            <component :is="playMB"></component>
        </div>
    </transition>


    
    
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import playmb from './components/playmb.vue'

export default {
  name: 'app',
  data:function(){
    return{
      tipsTxt:"测试信息",
      isTips:false,
      playMB:"",
      playPrama:{},
      isplay:false,
    }
  },
  components: {
     playmb
  },
  beforeCreate:function(){
     //console.log("-------000000");
     sessionStorage.curpage = 0;
     this.$router.push({path:"/"});
     var that=this; 
      //console.log("000000");
     Promise.all([this.$store.dispatch("getCyJson")]).then(function(results){
       ///////微信标识
       //console.log("111111");
      var Wid =that._getParameter("wid");    
      if(Wid){     
        localStorage.userWid=Wid;
      /////通过API取得数据
        that.$store.dispatch("VerificationW",{Wid:Wid}).then(response =>{
          if(response.Success){       
            var parametObj = {"uid":response.Value.UserId,"gid":response.Value.UserGrade==""?0:response.Value.UserGrade}
            that.$store.dispatch("getUserToken",parametObj).then(responseson => {
                localStorage.userToken = JSON.stringify(responseson);
                Promise.all([that.$store.dispatch("getAllPraise"),that.$store.dispatch("getAllCollection"),that.$store.dispatch("getLearnedList")]).then(function(result){
                      that.$store.dispatch("setAllDone",true);
                      that.$router.push({path:"/home"});
                });
                  }, responseson => {          
                    console.log("用户数据加载错误");
            });
          }else{
              localStorage.userToken="";
              that.$store.dispatch("setAllDone",true);
              that.$router.push({path:"/home"});
          }
      });
      }else{      
        localStorage.userToken="";
        that.$store.dispatch("setAllDone",true);
        that.$router.push({path:"/home"});
      }
         
      });       
  },
  mounted:function(){
  },
  computed:mapGetters(['getIsTips','getPlayStat']),
  watch:{
      getIsTips(data) {
         if(this.$store.getters.getIsTips){
          this.isTips = this.$store.getters.getIsTips;
          this.tipsTxt = this.$store.getters.getTipsTxt;
          var callbackfc=this.$store.getters.getTipscallback;
          var taht=this;
          setTimeout(function(){taht.closeTips(callbackfc)},1500);
         }
      },
      getPlayStat(data) {
         if(!localStorage.userToken){
            this.$store.dispatch("setIsPlay",{"isPlay":false,"pid":0,"playType":""}).then(response => {
                window.location.href="http://weixin.91118.com/index.html?openid="+ localStorage.userWid+"&url="+escape(window.location.href);
            }); 
         }else{
            if(this.$store.getters.getPlayStat){
                this.isplay = true;
                this.playMB = "playmb";
            }
         }
      },
      
      // '$route' (to, from) {
	    //     console.log(to.path);
      //     console.log(from.path);  
      // }
  },
  methods:{
    closeTips(callback){     
      this.$store.dispatch("setIsTips",false);
      this.isTips = false;
      if(typeof callback==='function'){
      callback();
      }
    },
    _getParameter(name){
      var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if(r!=null)return  unescape(r[2]); return null;
    },
    CloseDetail(){
        this.$store.dispatch("setIsPlay",{"isPlay":false,"pid":0,"playType":""});
        this.isplay = false;
        this.playMB = "";
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; 
  background-color:#e6e6e6;
  width:100%;
  height:100%;    
  display: flex;
  justify-content: center;
}

.detailHeader{height:.84rem; width:100%; background:#212121; position:absolute; top:0; left:0;}
.PlayBack{width:.84rem; height:.84rem; background:url(../src/assets/images/dot-back-play.png) no-repeat center; background-size:auto 50%; position:absolute; top:0; left:0;}

.flod-enter-active{
    animation-name:fadeInRight;animation-duration:.5s;
}
.tips-enter-active{
    animation-name:zoomIn;animation-duration:.5s;
}
.tips-leave-active{
    animation-name:zoomOut;animation-duration:.5s;
}
.detailBox{
  width:100%;
  height:100%;
  background:#f6f6f6;
  position: absolute;
  top:0;
  left:0;
  z-index:200;
  padding-top:.84rem;
}
</style>
