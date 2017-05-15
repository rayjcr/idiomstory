<template>
    <div class="learnedstoryBox flexColumn">
        
        <div class="listHeader">
            <div class="listHmain">
                <div class="sumstory">共{{sumstory}}个视频</div>
            </div>
        </div>
        <div v-show="isBlank" class="Blank">
            不积小流,无以成江海！现在就去学习吧！<br>
            <div class="Go" v-on:click="indexFn()">GO</div>
        </div>
        <div id="listMainBox" class="listMainBox flexBoxScroll">
            <li v-for="item in curList">
                <div class="storyImg" v-on:click="_play(item.Id)">
                    <img :src="hostadd+'jpg/'+item.VideoPath">
                    <div class="storyWacth">已学{{item.iWatchNum}}次</div>
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
export default {
  name: 'allstory',
  data:function(){
    return{
      hostadd:"//assets.91118.com/videohtml5/",
      sumstory:0,
      isBlank:true,
      allList:[],                 //全部数据
      curList:[],                 //页面显示的列表
      //curSumList:[],              //当前总列表
    }
  },
  components:{
    
  },
  mounted:function(){

        this.allList = this.$store.getters.getAllStory;  //获取全部视频播放数据
        var that = this;
        // this.$store.dispatch("getLearnedList").then(response => {
            //获取已学习过的数据
            var learnedList =  this.$store.getters.getLearnedList;
            if(learnedList.length==0){
                that.isBlank = true;
                that.$store.dispatch("setCurStory",[])
            }else{   
                for(var i=0;i<learnedList.length;i++){
                    //console.log(learnedList[i].videoid);
                    var findIndex =_.findIndex(that.allList, { 'Id': learnedList[i].videoid});
                    if(findIndex>-1){
                        that.allList[findIndex].iWatchNum=learnedList[i].wacthNum;
                        if(_.findIndex(that.curList,{'Id':learnedList[i].videoid})<0)
                        {
                           that.curList.push(that.allList[findIndex]);
                        }                        
                    }
                }
                that.$store.dispatch("setCurStory",that.curList)
                that.isBlank = false;
                that.sumstory=that.curList.length;
            }         
        // }, response => {
        //     console.log("数据读取错误,刷新下重试");
        // })

  },
  methods:{
    indexFn(){
        this.$store.dispatch("setHomeIndex",0);
        this.$emit('backHome',0);
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
    _play(pid){
        this.$store.dispatch("setIsPlay",{"isPlay":true,"pid":pid,"playType":""});
        //this.$router.push({path:'play',query:{pid:pid}})
    },   

  }

}
</script>

<style scoped>
.learnedstoryBox{background-color:#FFF;height:100%; width:100%;} 
.Blank{background:url(../../src/assets/images/blank.png) no-repeat center 1.5rem; width:100%; height:100%; background-size:60% auto; padding-top:5.1rem;font-size:.28rem; color:#999; text-align: center;}
.Go{width:2rem;height:.8rem; background:#00abec; font-size:.36rem; color:#FFF; text-align:center; line-height:.8rem; display: inline-block; margin-top:.5rem; border-radius:.4rem;}

</style>
