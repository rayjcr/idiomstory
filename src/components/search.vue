<template>
    <div class="searchBox flexColumn">
        <div class="searchHeader">
          <div class="searchMain">
            <div class="searchIpt">
              <input type="text" placeholder="请输入查询关键词" v-model="searchKey">
              <div class="deltxt" v-show="hasWord" v-on:click="clearSearch()"></div>
            </div>
          </div>
          <router-link :to="'/home'">
            <span class="cancel">取消</span>   
          </router-link>
        </div>
        <div class="wrap flexBox flexColumn">

          <div v-show="isBlank" class="Blank">
              没有找到你要的内容，先去看看其它的吧！<br>
              <router-link :to="'/home'">
              <div class="Go">GO</div>
              </router-link>
          </div>

          <div v-show="curList.length!=0" class="listMainBox flexBoxScroll">
            <!--<div v-show="sortShow" class="imask" v-on:click="touchMask()"></div>-->
            <li v-for="item in curList">
                <div class="storyImg" @click="_searchPlay(item.VideoName,item.Id)">
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

          <div v-show="!hasWord" class="searchDetail flexBoxScroll">
              <div class="lmtit" v-show="hotSearch.length>0">热门推荐</div>
              <div class="hotSearch">
                <ul>
                  <li v-for="item in hotSearch" @click="_searchPlay(item.VideoName,item.Id)">{{item.VideoName}}</li>
                </ul>
              </div>
              <div class="lmtit" v-show="historySearch.length>0">历史搜索</div>
              <div class="historySearch">
                <dl>
                  <dd v-for="item in historySearch" @click="_searchPlay(item.VideoNam,item.Id)">{{item.VideoName}}</dd>
                
                  <dt v-on:click="clearHistory()" v-show="historySearch.length>0">清空历史搜索</dt>
                </dl>
              </div>
          </div>

          <!--<div v-show="searchList.length==0&&hasWord" class="wordSearch">
              <div class="myKeyWord">搜索 " {{searchKey}} "</div>
              <div class="relatedSearchList">
                  <dl>
                    <dd v-for="item in relatedSearch" @click="searchKeys(item.value)">{{item.value}}</dd>
                  </dl>
              </div>
          </div>
          v-on:keyup="searchIn()"
          -->
        </div>     
    </div>
</template>

<script>
export default {
  name: 'search',
  data:function(){
    return{
      isBlank:false,         //搜索内容是否为空
      hasWord:false,         //搜索框是否有字符
      searchKey:"",          //绑定搜索关键字
      hotSearch:[],          //热门搜索
      historySearch:[],      //历史搜索
      curList:[],         //搜索出来的结果列表
      relatedSearch:[],      //输入后相关关键词提示列表
      allList:[],            //全部视频
      hostadd:"//assets.91118.com/videohtml5/",
    }
  },
  components:{ 
  },
  watch:{
    searchKey:function(){
  		if(this.searchKey.length!=0){
        this.hasWord = true;
        var that = this;
        this.curList = _.filter(this.allList, function(o) { 
          return !(o.VideoName.indexOf(that.searchKey)==-1); 
        });
        if(this.curList.length == 0){
          this.isBlank = true;
        }else{
          this.isBlank = false;
        }
      }else{
        this.hasWord = false;
        this.isBlank = false;
        this.curList = [];
      }
  	},
  },
  mounted:function(){ 

    this.allList = this.$store.getters.getAllStory;
    var that = this;
    //获取热门搜索关键词

    //console.log(localStorage.historySearch);
    //localStorage.historySearch = JSON.stringify([{"VideoName":"安然无恙"}])
    //_.sortedUniq([1, 1, 2]);
    if(localStorage.historySearch){
        //console.log(1);
        this.historySearch = JSON.parse(localStorage.historySearch);
    }else{
        //console.log(2);
        localStorage.historySearch = "[]";
    }

if(localStorage.userToken)
    {
    Promise.all([this.$store.dispatch("getSearchData"),this.$store.dispatch("getTopWacth")]).then(function(result){  
        var hotArr = [];
        for(var i=0;i<result[0].length;i++){
            hotArr.push(result[0][i].videoid);
        }
        hotArr = _.union(hotArr,result[1]);
        //console.log(hotArr);
        for(var i=0;i<hotArr.length;i++){
            that.hotSearch.push.apply(that.hotSearch,_.filter(that.allList,{"Id":hotArr[i]}));
        }
        // console.log(that.hotSearch);
    });
  }
    
  

  },
  methods:{
    goSearch(){
      this.isBlank = false;
      this.hasWord = false;
      this.searchKey = "";
    },
    searchIn(){
      if(this.searchKey.length!=0){

        var that = this;
        this.curList = _.filter(this.allList, function(o) { 
          return !(o.VideoName.indexOf(that.searchKey)==-1); 
        });
        if(this.curList.length == 0){
          this.isBlank = true;
        }else{
          this.isBlank = false;
        }
      }else{
        this.hasWord = false;
        this.isBlank = false;
        this.curList = [];
      }
    },
    clearSearch(){
      this.hasWord = false;
      this.searchKey = "";
    },
    clearHistory(){
      this.historySearch=[];
      localStorage.historySearch = JSON.stringify(this.historySearch)
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
    _searchPlay(pname,pid){

        var that = this;
        this.$store.dispatch("setSearchData",pid).then(response => {           
            that.historySearch = JSON.parse(localStorage.historySearch);            
            if(_.findIndex(that.historySearch, {'Id':pid})<0){
              that.historySearch.push({VideoName:pname,Id:pid});
              that.historySearch = _.takeRight(that.historySearch,10);
              localStorage.historySearch = JSON.stringify(that.historySearch)
            }
        },response => {
            console.log("err")
        })

        this.$store.dispatch("setIsPlay",{"isPlay":true,"pid":pid,"playType":"search"});
        //this.$router.push({path:'/play',query:{pid:pid,type:"search"}})
    },

  }

}
</script>

<style scoped>
.searchBox{background-color:#FFF; height:100%; width:100%;} 
.searchHeader{height:.95rem; background-color:#eceff1; position: relative;}
.Blank{background:url(../../src/assets/images/blank.png) no-repeat center 1.5rem; width:100%; height:100%; background-size:60% auto; padding-top:5.1rem;font-size:.28rem; color:#999; text-align: center;}
.Blank .Go{width:2rem;height:.8rem; background:#00abec; font-size:.36rem; color:#FFF; text-align:center; line-height:.8rem; display: inline-block; margin-top:.5rem; border-radius:.4rem;}
.searchHeader .cancel{height:.95rem; line-height:.95rem; color:#00abec; font-size:.32rem; width:1rem; position:absolute; top:0; right:0; text-align: center;}
.searchMain{width:6.5rem; height:.95rem; padding:.18rem 0 .17rem .24rem;}
.searchIpt{width:100%; height:.6rem; border-radius:.1rem; border:1px solid #cfd8dc; background:#FFF; position:relative; padding:0 .6rem;}
.searchIpt input{width:100%; height:100%; background:#FFF; line-height:.6rem; font-size:.28rem; color:#000;}
.searchIpt::before{content:'\20'; width:.6rem; height:.6rem; background:url(../../src/assets/images/dot-search.png) no-repeat center .17rem; background-size:45% auto; position: absolute; top:0; left:0;}
.searchIpt .deltxt{width:.6rem; height:.6rem; background:url(../../src/assets/images/dot-deltxt.png) no-repeat center .12rem; background-size:55% auto; position: absolute; top:0; right:0;}
.searchIpt input::-webkit-input-placeholder{color:#ccc;}
.lmtit{font-size:.24rem; color:#666; padding-left:.25rem; margin-top:.3rem; line-height:.4rem;}
.hotSearch{padding:0 .22rem;}
.hotSearch li{font-size:.28rem; color:#666; display: inline-block; height:.64rem; line-height:.62rem; padding:0 .22rem; border:1px solid #e0e0e0; margin-top:.15rem; margin-right:.15rem; border-radius:.32rem;}
.hotSearch li:active{background:#00abec; border:1px solid #00abec; color:#FFF;}
.historySearch{padding:0 .25rem;}
.historySearch dd{border-bottom:1px solid #e0e0e0; width:100%; padding:.26rem 0; font-size:.3rem; background:url(../../src/assets/images/dot-time.png) no-repeat center left;
background-size: auto 35%; padding-left:.5rem;}
.historySearch dt{text-align: center; color:#00abec; font-size:.32rem; padding:.3rem;}
.wordSearch{padding:0 .25rem;}
.myKeyWord{font-size:.32rem; color:#38acff; height:1rem; line-height:1rem; border-bottom:1px solid #e0e0e0;}
.relatedSearchList dd{border-bottom:1px solid #e0e0e0; width:100%; padding:.26rem 0; font-size:.3rem; background:url(../../src/assets/images/dot-time.png) no-repeat center left;
background-size: auto 35%; padding-left:.5rem;}

</style>
