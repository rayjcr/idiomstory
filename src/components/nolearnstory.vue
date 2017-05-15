<template>
    <div class="nolearnstoryBox flexColumn">
        <div class="listHeader">
            <div class="listHmain">
                <div class="sumstory">共{{sumstory}}个视频</div>
            </div>
        </div>
        <div v-show="isLearnAll" class="LearnAll">
          你已经学完了所有的内容哦~
        </div>
        <div id="listMainBox_nl" class="listMainBox flexBoxScroll">
            <li v-for="item in curList">
                <div class="storyImg" v-on:click="_play(item.Id)">
                    <img :src="hostadd+'jpg/'+item.VideoPath">
                    <div class="storyWacth">{{item.WatchNum}}</div>
                </div>
                <div class="storyName">{{item.VideoName}}</div>
                <div class="storyInfo">
                    <span class="heart" v-bind:class="{active:item.isHeart}" v-on:click="click_heart(item.Id,item.isHeart)">{{item.PraiseNum}}</span>
                    <span class="collection" v-bind:class="{active:item.isCollection}" v-on:click="click_collection(item.Id,item.isCollection)">{{item.CollectionNum}}</span>
                </div>
            </li>           
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import utils from '../lib/utils.js';

export default {
  name: 'allstory',
  data:function(){
    return{
      hostadd:"//assets.91118.com/videohtml5/",
      sumstory:0,
      isLearnAll:false,
      scroll:true,                //是否可以滚动加载数据
      allList:[],                 //全部数据
      allListPage:[],             //已经分好页码的全部数据
      curpage:0,                  //当前页码
      scroll:true,                //是否可以滚动加载数据
      curList:[],                 //页面显示的列表
    }
  },
  components:{
    
  },
  mounted:function(){
     this.allList = this.$store.getters.getAllStory;  //获取全部视频播放数据
     var that = this;
        // this.$store.dispatch("getLearnedList").then(response => {
            var learnedList = this.$store.getters.getLearnedList;
            that.sumstory=this.allList.length-learnedList.length;
            if(this.allList.length-learnedList.length==0){
                that.isLearnAll = true;
                that.$store.dispatch("setCurStory",[]);
            }else{    

                that.curList=_.filter(this.allList,function(o){return _.findIndex(learnedList,['videoid',o.Id])<0;}); 
                that.$store.dispatch("setCurStory",that.curList);
                that.isBlank = false;
               
                that.allListPage = _.chunk(that.curList,10);
                that.curList= that.allListPage[0];
                that.curpage=0;               
                //that._getStory();
            }         
        // }, response => {
        //     console.log("数据读取错误,刷新下重试");
        // })

        //监听滚动事件..做滚动加载
        document.getElementById("listMainBox_nl").addEventListener('scroll',utils.throttle(this.getScrollData, 300, 1000));

  },
  methods:{
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
    _play(pid){
        this.$store.dispatch("setIsPlay",{"isPlay":true,"pid":pid,"playType":""});
        //this.$router.push({path:'play',query:{pid:pid}})
    }, 
    getScrollData() {
        if (this.scroll) {
            var box = document.getElementById("listMainBox_nl")
            var totalheight = box.offsetHeight + box.scrollTop + 100;
            if (box.scrollHeight <= totalheight) {
                this.scroll = false;
                this.curpage = this.curpage + 1;
                sessionStorage.curpage=this.curpage;
                this._getStory();
            }
        }
    },
    _getStory(){
        this.curList.push.apply(this.curList,this.allListPage[this.curpage]);
        this.scroll = true;
        //this.$store.dispatch("setCurPage",this.curpage);
        sessionStorage.curpage = this.curpage;
    }, 

  }

}
</script>

<style scoped>
.nolearnstoryBox{background-color:#FFF;height:100%; width:100%;}
.LearnAll{background:url(../../src/assets/images/goodjob.png) no-repeat center 1.5rem; width:100%; height:100%; background-size:60% auto; padding-top:5.1rem;font-size:.3rem; color:#000; text-align: center;}

</style>
