<template>
    <div class="allstoryBox flexColumn">
        
        <div class="listHeader">
            <div class="listHmain">
                <div class="sumstory">共{{sumstory}}个视频</div>
                <div class="sort" v-bind:class="{active:sortShow}" v-on:click="sortFun()">{{sortTxt}}</div>
            </div>
            <transition name="slider">
            <div v-show="sortShow" class="sortList">
                <li v-bind:class="{active:sortNum==0}" v-on:click="choiceSort(0,'默认排序')">默认排序</li>
                <li v-bind:class="{active:sortNum==1}" v-on:click="choiceSort(1,'综合排序')">综合排序</li>
                <li v-bind:class="{active:sortNum==2}" v-on:click="choiceSort(2,'最多人看')">最多人看</li>
                <li v-bind:class="{active:sortNum==3}" v-on:click="choiceSort(3,'最多赞')">最多赞</li>
            </div>
            </transition>

        </div>
        <div id="listMainBox" class="listMainBox flexBoxScroll">
            <div v-show="sortShow" class="imask" v-on:click="touchMask()"></div>
            <li v-for="item in curList">
                <div class="storyImg" v-on:click="_play(item.Id)">
                    <img :src="hostadd+'jpg\\'+item.VideoPath">
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

// import Vue from 'vue'
// import axios from 'axios'
// import $ from 'jquery'
import _ from 'lodash'
import utils from '../lib/utils.js';
// Vue.prototype.$http = axios     //axios纯在跨域问题
// import {mapGetters} from 'vuex';

export default {
  name: 'allstory',
  data:function(){
    return{
        sumstory:0,
        sortTxt:"默认排序",
        sortShow:false,
        sortNum:0,                  //默认排序 0 
        curList:[],                 //页面显示的列表
        allList:[],                 //全部数据
        allListPage:[],             //已经分好页码的全部数据
        curpage:0,                  //当前页码
        hostadd:"//assets.91118.com/videohtml5/",
        scroll:true,                //是否可以滚动加载数据
        praiseList:[],              //所有赞的数据
        collectionList:[],              //所有赞的数据
    }
  },
  components:{
    
  },
  mounted:function(){
    //初始化数据
    this._init();
  },
  methods:{
    //初始化页面
    _init(){
        //获取所有数据..如果已经保存到story里就获取story里的。如果没有就是 []
        //(localStorage.allList) ? this.allList = JSON.parse(localStorage.allList) : this.allList = [];  
        this.allList = this.$store.getters.getAllStory; 

        this.$store.dispatch("setCurStory",this.allList)

        //获取赞和收藏
        this.getPraiseAndCollection();    

        //这里要过滤sessionStorage.curpage = null 的判断
        this.curpage = parseInt(sessionStorage.curpage);
        //(sessionStorage.curpage) ? this.curpage=sessionStorage.curpage : this.curpage=0;

        //将全部数据按照10条记录一页，分页
        this.allListPage = _.chunk(this.allList,10);
        //加载到当前页为止的所有数据
        for(var i=0;i<=this.curpage;i++){
            this.curList.push.apply(this.curList,this.allListPage[i]);
        }
        //统计所有记录条总数
        this.sumstory = this.allList.length;

        //监听滚动事件..做滚动加载
        //utils.throttle(this.getScrollData, 300, 1000)
        //document.getElementById("listMainBox").addEventListener('scroll',this.getScrollData);
        document.getElementById("listMainBox").addEventListener('scroll',utils.throttle(this.getScrollData, 300, 1000));
    },
    //取得用户点赞信息
    getPraiseAndCollection(){
        //获得所有赞和收藏的数据
        this.praiseList = this.$store.getters.getPraiseList;
        this.collectionList = this.$store.getters.getCollectionList;

        //console.log(this.praiseList);
        //console.log(this.collectionList);

        for(var i=0;i<this.praiseList.length;i++){
            var _index = _.findIndex(this.allList,{'Id':this.praiseList[i].videoid})
            this.allList[_index].isHeart = true;
            this.$set(this.allList,_index,this.allList[_index])
        }

        for(var i=0;i<this.collectionList.length;i++){
            var _index = _.findIndex(this.allList,{'Id':this.collectionList[i].videoid})
            this.allList[_index].isCollection = true;
            this.$set(this.allList,_index,this.allList[_index])
        }

        //将全部数据按照10条记录一页，分页
        //that.allListPage = _.chunk(that.allList,10);
        //初始化第一条记录赋值到当前数据变量this.curList中.
       // that.curList.push.apply(that.curList,that.allListPage[0]);
        

        // var that = this;
        // Promise.all([this.$store.dispatch("getAllPraise"), this.$store.dispatch("getAllCollection")]).then(function (result) {
            
        // }).catch(function(r){
        //     console.log(r);
        //     that.$store.dispatch("setIsTips",{"_isShow":true,"_value":"用户数据读取失败"});

        //     //将全部数据按照10条记录一页，分页
        //     that.allListPage = _.chunk(that.allList,10);
        //     //初始化第一条记录赋值到当前数据变量this.curList中.
        //     that.curList.push.apply(that.curList,that.allListPage[0]);
        // });
    },

    //直接传id参数去action里改变store的值.直接mutations.js保存
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
    sortFun(){
        this.sortShow = !this.sortShow;
    },
    touchMask(){
        this.sortShow = !this.sortShow;
    },
    choiceSort(num,txt){
        this.sortNum = num;
        this.sortTxt = txt;
        this.sortShow = false;
        switch(num)
        {
            case 0:
            this.allList= this.$store.getters.getAllStory;         
            break;
            case 1:
            this.allList=_.orderBy(this.allList,[function(o) { return o.WatchNum+o.PraiseNum; }],['desc']);
            break;
            case 2:
            this.allList=_.orderBy(this.allList,['WatchNum'],['desc']);
            break;
            case 3:
            this.allList=_.orderBy(this.allList,['PraiseNum'],['desc']);
            break;
        }
        this.$store.dispatch("setCurStory",this.allList);
        //this.allList=_.orderBy(this.allList,['PraiseNum'],['desc']);
        this.allListPage = _.chunk(this.allList,10);
        this.curList=[];
        this.curpage=0;
        document.getElementById('listMainBox').scrollTop = 0;
        this._getStory();
    },
    _play(pid){
        this.$store.dispatch("setIsPlay",{"isPlay":true,"pid":pid,"playType":""});
        //this.$store.dispatch("setTIsPlay",true);
        //console.log(this.$store.getters.getIsPlay);
        //this.$router.push({path:'play',query:{pid:pid}})
    },
    getScrollData() { 
        
        // console.log("SH="+box.offsetHeight);
        // console.log("SH="+box.scrollTop);
        if (this.scroll) {   
            var box = document.getElementById("listMainBox")      
            var totalheight = box.offsetHeight + box.scrollTop + 400;
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
.allstoryBox{background-color:#FFF; height:100%; width:100%;} 
.sumstory{font-size:.24rem; color:#999; line-height:.6rem; float:left; padding-left:.2rem;}



</style>
