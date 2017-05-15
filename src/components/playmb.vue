<template>
    <div class="videoPlayBox flexColumn">
        <!--<div class="PlayHeader">-->
            <!--<router-link :to="'/home'">-->
            <!--<div class="PlayBack" v-on:click="_goBack()"></div>-->
            <!--</router-link>-->
        <!--</div>-->

        <div class="PlayRollBox flexBox" id="PlayRollBox">
          <div class="playList" id="playList">
            <li v-bind:class="{cur:index==curIndex}" v-for="(item,index) in curList" track-by="$index">
                <div class="playTit">{{item.VideoName}}</div>
                <div class="playImg">
                  <img v-show="!isPlay||!(index==curIndex)" :src="hostadd+'jpg/'+item.VideoPath"/>
                  <div v-show="!isPlay" class="playbtn" v-on:click="playNow(index)"></div>
                  <video :id="'play'+index" preload="metadata" v-if="index==curIndex"  v-show="isPlay" x-webkit-airplay="true" playsinline  webkit-playsinline="true" x5-video-player-type="h5" controls="controls">
                  </video>          
                <!--<video id="play" preload="none" v-if="index==curIndex" v-on:click="playNow()" :src="hostadd+'video/'+item.VideoImgPath" x-webkit-airplay="true" playsinline  webkit-playsinline="true" x5-video-player-type="h5" controls="controls">
				        </video>          -->
                </div>
                <div class="playInfo">{{item.WatchNum}}人观看
					<div class="p-heart" v-bind:class="{active:item.isHeart}" v-on:click="click_heart(item.Id,item.isHeart)">{{item.PraiseNum}}</div>
					<div class="p-fav" v-bind:class="{active:item.isCollection}" v-on:click="click_collection(item.Id,item.isCollection)">{{item.CollectionNum}}</div>
                </div>
                <div class="Pmask"></div>
            </li>
          </div>
        </div>
    
		<div class="autoPlayTips" v-show="isNext">下一个视频</div>

    <!--<div class="weixinPlay" v-show="isWeiXin">
        <div class="closePlay" v-on:click="_closeWxPlayer()">返回列表</div>
        <video id="playWX" preload="metadata"  x-webkit-airplay="true" playsinline webkit-playsinline="true" x5-video-player-type="h5" controls="controls"> 
      </video>
    </div>-->

    </div>
</template>

<script>

import $ from 'jquery';
export default {
  props:["prams"],
  name: 'playmb',
  data:function(){
    return{
      startY:0,           //鼠标当前点击的坐标Y
      TarObj:{},          //操作的原生对象
      curY:0,             //当前的坐标位置top
      curIndex:1,         //当前视频播放在列表里的序列号，初始化需计算
      curList:[],
      allList:[],         //所有视频数据
      curSum:0,           //总长度
      HtmlFont:0,
      isPlay:false,       //是否播放
      PlayerObj:{},       //播放对象
      isNext:false,       //播放下一个的提示
      isWeiXin:false,     //是否微信浏览器
      curSrc:"",          //当前播放的视频地址
      curpage:0,          //当前页码
      hostadd:"//assets.91118.com/videohtml5/",
      timer:null,
      playStatus:false,   //是否播放状态
      
    }
  },
  components:{
  },
  mounted:function(){

    var prams = this.$store.getters.getIsPlay
    console.log(prams);
    if(prams.isPlay){
      // var pid = parseInt(this.$route.query.pid); 
      // var _type = this.$route.query.type;
      var pid = prams.pid; 
      var _type = prams.playType;
      if(_type=="search"){
        this.allList = _.filter(this.$store.getters.getCurStory, {'Id':pid});
      }else{
        //读取列表页所有数据列表
        this.allList = this.$store.getters.getCurStory;
      }

      //设置当前点击的视频在列表中的初始位置
      this.curIndex = _.findIndex(this.allList, {'Id':pid});
      
      // console.log(sessionStorage.curpage);
      // (sessionStorage.curpage) ? this.curpage = parseInt(sessionStorage.curpage) : this.curpage = parseInt(this.curIndex/10)+1;
      // //this.curpage = parseInt();
      //设置当前页码
      this.curpage = parseInt(this.curIndex/10)+1;

      //分页转换10条记录一页
      var allListPage = _.chunk(this.allList,10); 
      for(var i=0;i<=this.curpage;i++){
          this.curList.push.apply(this.curList,allListPage[i]);
      }

      //取得rem的基准值.页面单位是rem.手指移动单位是px
      this.HtmlFont = document.getElementsByTagName('html')[0].style.fontSize.replace("px","");

      //播放列表总长度
      this.curSum = this.curList.length;

      //手指控制的对象保存到页面变量方便控制 this.TarObj
      var touchobj = document.getElementById("playList");
      this.TarObj = touchobj

      //$(this.TarObj).css({"transform":"translateY(-"+(this.curIndex*8)+"rem)",});
      //监听手指动作上翻下翻
      touchobj.addEventListener("touchstart", this.touchstartfun,"e",false);
      touchobj.addEventListener("touchend", this.touchendfun,"e",false);		
      touchobj.addEventListener("touchmove", this.touchmovefun,"e",false);	

      //设置当前播放源地址(变量为在微信中播放是弹层调用这个地址用) 为 当前curIndex源地址
      this.curSrc = this.curList[this.curIndex].VideoImgPath;

      //console.log("this.curIndex="+this.curIndex)
      //停留在当前的播放视频
      this.playVideo();
    }

    

  },
  destroyed:function(){
      clearTimeout(this.timer);     
  },
  methods:{
    touchstartfun(e){
      this.startY = e.changedTouches[0].clientY;
      this.curY = $(this.TarObj).position().top;
      $(this.TarObj).css({"transition":"initial"}); //消除"transition": ".4s all"带来的卡顿现象
    },
    touchmovefun(e){
		    e.preventDefault(); 
        var actY = e.changedTouches[0].clientY;	  //触摸移动位置
        
        if(actY-this.startY<0){
            var stepY = Math.abs(actY-this.startY);
            //console.log(stepY);
            var opacity = 0.9*stepY/(this.HtmlFont*4);
            if(opacity>0.9)
            opacity=0.9
            $(this.TarObj).children(".cur").children(".Pmask").css({"opacity":opacity,"z-index":10});
            $(this.TarObj).children(".cur").next().children(".Pmask").css({"opacity":(0.9-opacity)});
        }else{
            var stepY = Math.abs(actY-this.startY);
            var opacity = 0.9*stepY/(this.HtmlFont*4);
            if(opacity>0.9)
            opacity=0.9
            $(this.TarObj).children(".cur").children(".Pmask").css({"opacity":opacity,"z-index":10});
            $(this.TarObj).children(".cur").prev().children(".Pmask").css({"opacity":(0.9-opacity)});
        }

        if(Math.abs(actY-this.startY)>10){
         $(this.TarObj).css({"transform":"translateY("+(this.curY+actY-this.startY)+"px)",});
        }
       

    },
    touchendfun(e){
        var actY = e.changedTouches[0].clientY;	
        if((actY-this.startY)<-this.HtmlFont*3){

          if(this.curIndex<this.curSum-1){
            this.curIndex++;
            this.curSrc = this.curList[this.curIndex].VideoImgPath;
          }
          this.isPlay = false;
        }
        if((actY-this.startY)>this.HtmlFont*3){
          if(this.curIndex != 0){
            this.curIndex--;
            this.curSrc = this.curList[this.curIndex].VideoImgPath;
          }
		      this.isPlay = false;  
        }

        if((this.curIndex+1)==(this.curpage+1)*10){
          this.nextPage();
        }

		    $(this.TarObj).children("li").eq(this.curIndex).children(".Pmask").css({"z-index":-1});
        $(this.TarObj).children("li").children(".Pmask").css({"opacity":""});
        if(this.isPlay){
            $(this.TarObj).css({"transform":"translateY(-"+(this.curIndex*8)+"rem)","transition": ".5s all"});
        }else{
            this.playVideo();
        }
    },
    click_heart(pid,curState){
      if(!curState){
          var paramObj = {thisobj:this,pid:pid}
          this.$store.dispatch("click_heart",paramObj);
      }else{
          this.$store.dispatch("setIsTips",{"_isShow":true,"_value":"已经点赞"});
      }
    },
    click_collection(pid,curState){
        if(!curState){
            var paramObj = {thisobj:this,pid:pid}
            this.$store.dispatch("chick_collection",paramObj);
        }else{
            this.$store.dispatch("setIsTips",{"_isShow":true,"_value":"已经收藏"});
        }
    },
    //将当前视频移动到播放位置，并设置2个video标签的src属性
    playVideo(){
      this.playStatus =  false;
      this.isNext = false;
      $(this.TarObj).css({"transform":"translateY(-"+(this.curIndex*8)+"rem)","transition": ".5s all"});
      // console.log("222");
      // this.$nextTick(function () {
      //     console.log("123");
      //     this.PlayerObj = document.getElementById("play"+indexnum);
      //     this.PlayerObj.src = this.hostadd + 'video/' + this.curSrc;
      //     var wxPlay = document.getElementById("playWX");
      //     wxPlay.src = this.hostadd + 'video/' + this.curSrc;
      //     $("#play"+indexnum).parent().children(".playbtn").trigger("click");
      // });   
    },
    //点击播放按钮执行视频播放
    playNow(indexnum){    
      clearTimeout(this.timer);    
      var u = navigator.userAgent;     
      //QQWeiXin浏览器
      // if(u.indexOf('QQ') == -1){
      //   this.isWeiXin = true;
      //   var that = this;
      //   this.$nextTick(function () {
      //     var wxPlay = document.getElementById("playWX");
      //     wxPlay.src = this.hostadd + 'video/' + this.curSrc;
      //     // $("#play"+indexnum).parent().children(".playbtn").trigger("click");
      //     document.getElementById("playWX").play();
      //     this._eventPlay("canplay",document.getElementById("playWX"));
      //     document.getElementById("playWX").onended=function(){
      //       that.isWeiXin = false;
      //       that.isPlay = false;
      //       that.isNext = that._hasNextVideo();
      //       setTimeout(function(){
      //         that.nextVideo();
      //       },3000)
      //     }
      //   })
     //}else{ 
        var that = this;        
        this.$nextTick(function () {          
          this.PlayerObj = document.getElementById("play"+indexnum);
          this.PlayerObj.src = this.hostadd + 'video/' + this.curSrc;         
         // $("#play"+indexnum).parent().children(".playbtn").trigger("click");
            // this.PlayerObj.load();
            this.PlayerObj.play();
            //给video加play事件..加载后计算总时间长度，并设置定时器在时间节点+1
            this._eventPlay("canplay",document.getElementById("play"+indexnum));
            //监听是否播放完成，播放完成以后停顿3秒后执行 nextVideo();
            this.PlayerObj.onended=function(){
              console.log(that.PlayerObj);
              that.isPlay = false;
              that.isNext = that._hasNextVideo();
              setTimeout(function(){
                that.nextVideo();
                that.playStatus=false;
              },3000)
            }
        })
        

      //}
    },
    //自动播放下一条记录(只在自动跳转下一个视频时会执行此方法)
    nextVideo(){
      this.playStatus=false;
      this.curIndex++;
      clearTimeout(this.timer);
      if(this.curIndex>this.curSum-1){
          this.curIndex = this.curSum-1;
      }
      if((this.curIndex+1)==(this.curpage+1)*10){
          this.nextPage();
      }
      this.curSrc = this.curList[this.curIndex].VideoImgPath;
      //console.log($("#play"));
      //console.log(document.getElementById("play"));
      // console.log($("#play").parent().children(".playbtn"));
      this.playVideo(this.curIndex);
      
      //$("#play ~ div").trigger("click");
      //this.playNow();
      //模拟用户点击
      //document.getElementById("play").previousElementSibling.click();
    },
    //当播放到最后一个视频的时候，会加载allListPage里的下一页视频记录
    nextPage(){
        this.curpage += 1;
        sessionStorage.curpage = this.curpage; 
        // console.log(this.curpage);
        // console.log(this.allList);
        //var sumList = JSON.parse(this.allStory)
        var allListPage = _.chunk(this.allList,10); 
        this.curList.push.apply(this.curList,allListPage[this.curpage]);
        this.curSum = this.curList.length;
    },
    _goBack(){
        this.$router.go(-1);
    },
    _eventPlay(e,playobj){
        //console.log(playobj);
        var that = this;
        playobj.addEventListener(e,function(){
            if(that.playStatus){
              playobj.pause();
            }else{
              playobj.play();
            }
            that.playStatus=!that.playStatus;
            // console.log(playobj);
            var duration=playobj.duration;
            if(duration==0)
            {
              duration+=60;
            }
            if(!that.isPlay){
              that.isPlay=true;
              that.timer=setTimeout(function(){ 
                 console.log(playobj.duration);
                 console.log(duration);
              console.log(playobj.currentTime);
                that.$store.dispatch("setLearned",that.curList[that.curIndex].Id);
            },duration*1000*0.5)
            }
        });
        //console.log("11111")
    },
    _hasNextVideo(){
      //判断是不是列表中的最后一个视频
      if(this.curIndex+1==this.curList.length){
        return false
      }
      return true
    },
    _closeWxPlayer(){
      this.isWeiXin = false;
      this.isPlay=false;
    }


  }
}




</script>

<style scoped>
#playWX{width:100%; height:100%;}       
#play{opacity:1;}
.videoPlayBox{background-color:#212121; height:100%; width:100%;} 
.PlayHeader{height:.84rem; width:100%; background:#212121; position:relative;}
.PlayBack{width:.84rem; height:.84rem; background:url(../../src/assets/images/dot-back-play.png) no-repeat center; background-size:auto 50%; position:absolute; top:0; left:0;}

.PlayRollBox{ position: relative}
.playList{ position: absolute; top: 0; left:0; width:100%;}
.playList li{width:100%; height:8rem; position: relative;}
.playList li .Pmask{position: absolute; width:100%; transition:.4s all; height:100%; background:rgb(33, 33, 33); opacity:.9; z-index:10; top:0; left:0}
.playList li.cur .Pmask{opacity:0; z-index:-1;}
.playList li img{width: 100%; height:100%;}
.playList .playTit{width: 100%; height:1rem; line-height:1rem; font-size:.34rem; color:#FFF; padding:0 .25rem;}
.playList .playImg{width: 100%; height:6rem; position: relative;}
.playList .playbtn{width:1.5rem; height:1.5rem; background:url(../../src/assets/images/dot-v-play.png) no-repeat center; background-size:100% 100%; position:absolute; z-index:1; top:50%; left:50%; transform: translate(-50%,-50%);-webkit-transform: translate(-50%,-50%);}
.playList .playImg video{width: 100%; height:6rem; position: absolute; top:0; left:0; z-index:1;}
.playList .playInfo{width: 100%; height:1rem; line-height:1rem;font-size:.26rem; color:#FFF; padding:0 .25rem; position: relative;}
.playInfo .p-heart{height:.35rem; padding-left:.5rem; background:url(../../src/assets/images/dot-heart-w.png) no-repeat left center; background-size:auto 100%; position:absolute; top:.32rem;left:3.5rem;}
.playInfo .p-fav{height:.35rem; padding-left:.5rem; background:url(../../src/assets/images/dot-fav-w.png) no-repeat left center; background-size:auto 100%; position:absolute; top:.32rem;left:6rem;}
.playInfo .p-heart.active{background:url(../../src/assets/images/dot-heart-w-h.png) no-repeat left center; background-size:auto 100%;}
.playInfo .p-fav.active{background:url(../../src/assets/images/dot-fav-w-h.png) no-repeat left center; background-size:auto 100%;}
.playInfo .p-heart,.playInfo .p-fav{font-size:.32rem; color:#FFF; line-height:.35rem;}
.autoPlayTips{width:2.4rem; height:.7rem; background:rgba(0, 0, 0, .7); border-radius:.35rem; position:absolute; bottom:1rem; left:50%; transform: translateX(-50%);-webkit-transform: translateX(-50%); font-size:.28rem; line-height:.7rem; color:#999; text-align: center;}
.weixinPlay{width:100%; height:100%; position:absolute; top: 0; z-index: 999; left:0; background:#000;}
.closePlay{width:100%; font-size:.35rem; text-align: center; position: absolute; top:1.5rem; color:#FFF; z-index:999;}
#playWX{width:100%; height:100%;}

</style>
