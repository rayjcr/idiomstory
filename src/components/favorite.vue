<template>
    <div class="favoriteBox flexColumn">
		<div class="favoriteHeader">
			<router-link :to="'/home'">
				<div class="btn-back"></div>
			</router-link>
			<div class="h-tit">我的收藏</div>
			<div class="h-del" v-show="!isBlank" v-on:click="_del()">{{delTxt}}</div>
        </div>

		<div class="wrap flexBox flexColumn">
		<div v-show="isBlank" class="Blank">
			还没有收藏内容,先去看看其它的吧！<br>
			<router-link :to="'/home'">
              <div class="Go">GO</div>
            </router-link>
		</div>
		<div class="listMainBox flexBoxScroll" style="padding-bottom:1.2rem;">
            <li v-for="item in curList">
				<div class="storyImg" v-bind:class="{seled:item.check}" v-on:click="_check(item)">
                    <img :src="hostadd+'jpg\\'+item.VideoPath">
                    <div class="storyWacth">{{item.WatchNum}}</div>
					<transition name='sel'>
						<div class="select" v-show="isDel"></div>
					</transition>
                </div>
                <div class="storyName">{{item.VideoName}}</div>
                <div class="storyInfo">
                    <span class="heart" v-bind:class="{active:item.isHeart}" v-on:click="click_heart(item.Id,item.isHeart)">{{item.PraiseNum}}</span>
                    <span class="collection" v-bind:class="{active:item.isCollection}" v-on:click="click_collection(item.Id,item.isCollection)">{{item.CollectionNum}}</span>
                </div>
            </li>
        </div>
    
		<transition name='del'>
			<div class="delCont" v-show="isDel">
				<div class="allCheck" v-bind:class="{check:isAll}" v-on:click="_allselect()">全选</div>
				<div class="checkCount" v-on:click="_delfav()">删除({{checkCount}})</div>
			</div>
		</transition>

		<div v-if="isShowLayer" class="mask"></div>
		<transition name='tips'>
			<div v-if="isShowLayer" class="layer delFav" >
				<div class="delFav-Head"></div>
				<div class="delFav-Cont">确定要删除吗？</div>
				<div class="delFav-Btn">
					<button class="cancel" v-on:click="_cancelDel()">取消</button>
					<button class="confirm" v-on:click="_confirmDel()">确定</button>
				</div>
			</div>
		</transition>
		</div>
	</div>
</template>

<script>
export default {
  name: 'favorite',
  data:function(){
    return{
		isBlank:true,
		isShowLayer:false,			  //是否显示弹层
		ListCount:0,                  //收藏的列表总数
		isAll:false,                  //是否全选
		checkCount:0,
		delTxt:"删除",                //头部显示的文字
		isDel:false,                  //是否选择删除
		curList:[],
		allList:[],
		hostadd:"//assets.91118.com/videohtml5/",
    }
  },
  components:{ 
  },
  mounted:function(){ 
	this.allList = this.$store.getters.getAllStory;
	var that = this;
		var favoriteList = this.$store.getters.getCollectionList;
		if(favoriteList.length==0){
			this.isBlank = true;
			this.$store.dispatch("setCurStory",[])
		}else{   
			for(var i=0;i<favoriteList.length;i++){				
				var findIndex =_.findIndex(this.allList, { 'Id': favoriteList[i].videoid});
				if(findIndex>-1){
					this.curList.push(this.allList[findIndex]);
				}
			}
			this.$store.dispatch("setCurStory",this.curList)
			this.isBlank = false;
			this.ListCount=this.curList.length;

			//给数据加上是否选中的属性。为了方便多选判断
			for(var i=0;i<this.curList.length;i++){
				this.curList[i]["check"]=false;
			}
		} 
  },
  methods:{
	_check(itemobj){
		if(this.isDel){
			if(itemobj.check){
				this.checkCount--;
			}else{
				this.checkCount++;
			}
			if(this.checkCount==this.ListCount&&this.checkCount!=0){
				this.isAll = true;
			}else{
				this.isAll = false;
			}
			itemobj.check = !itemobj.check;
		}else{
			  this.$store.dispatch("setIsPlay",{"isPlay":true,"pid":itemobj.Id,"playType":""});
			  //this.$router.push({path:'play',query:{pid:itemobj.Id}});
		}
	},
	_del(){
		if(this.isDel){
			this.isDel = false;
			this.delTxt = "删除";
		}else{
			this.isDel = true;
			this.delTxt = "取消";
		}
	},
	_allselect(){
		if(this.isAll){
			for(var i=0;i<this.curList.length;i++){
				this.curList[i]["check"]=false;
			}
			this.isAll = false;
			this.checkCount = 0;
		}else{
			for(var i=0;i<this.curList.length;i++){
				this.curList[i]["check"]=true;
			}
			this.isAll = true;
			this.checkCount = this.ListCount; 
		}
	},
	_delfav(){
		if(this.checkCount==0){
			this.$store.dispatch("setIsTips",true);
       		this.$store.dispatch("setTipsTxt","您没有选中任何视频");
	  	}else{
			this.isShowLayer = true;
		}
	},
	_cancelDel(){
		this.isShowLayer = false;
	},
	_confirmDel(){

		var delArrar = _.map(_.filter(this.curList,['check', true]),"Id");		
		var that=this;
		 that.isShowLayer = false;
		this.$store.dispatch("setDelCollection",delArrar).then(response => {
			_.remove(that.curList,['check', true]);
		    that.checkCount=0;
		    that.ListCount=that.curList.length;		
			if(that.ListCount==0){
				that.isBlank = true;
			}else{
				that.isBlank = false;
			}
			that.isDel = false;
			that.delTxt = "删除";
        },response => {
            console.log("err")
        })
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
    }
  },

}
</script>

<style scoped>

.favoriteBox{background-color:#FFF; height:100%; width:100%;} 
.favoriteHeader{height:.9rem; background-color:#FFF; border-bottom:1px solid #e0e0e0; position: relative;}
.favoriteHeader .btn-back{width:.65rem; height:.9rem;position: absolute; top:0; left:0; background:url(../../src/assets/images/dot-back.png) no-repeat center; background-size:auto 40%;}
.favoriteHeader .h-tit{width: 50%; height:.9rem; position:absolute; top:0; left:25%; text-align: center; font-size:.34rem; color:#000; line-height:.9rem;}
.favoriteHeader .h-del{width:1rem; height:.9rem; font-size:.3rem; line-height:.9rem; text-align:center; color:#00abec; position:absolute; top:0; right:0;}
.listMainBox .select{background:url(../../src/assets/images/dot-select.png) no-repeat; width:.46rem; height:.46rem; background-size:100% 100%; position:absolute; top:.2rem; right:.2rem;}
.listMainBox .seled .select{background:url(../../src/assets/images/dot-selected.png) no-repeat; background-size:100% 100%;}
.delCont{background:rgba(255, 255, 255, .9); width:100%; height:.9rem; position:absolute; bottom:0; left:0; box-shadow:0 -2px 4px rgba(200, 200, 200,.4)}
.allCheck{height:.9rem; margin-left:.2rem; background:url(../../src/assets/images/dot-allselect.png) no-repeat left center;background-size:auto 50%; padding-left:.6rem; line-height:.9rem; font-size:.32rem; color:#666;float: left;}
.allCheck.check{ background:url(../../src/assets/images/dot-selected.png) no-repeat left center;background-size:auto 50%;}
.checkCount{font-size:.32rem; color:#fe5722; float:right; margin-right:.2rem; line-height:.9rem;}

/*确认删除弹层*/
.delFav{width:6rem; height:4.6rem; background:#FFF; border-radius:.1rem; top:30%;left:0.75rem;}
.delFav-Head{background:url(../../src/assets/images/layergen-bg.png) no-repeat; width:2.8rem; height:2.8rem; position: absolute; top:-1.4rem; left:1.6rem; background-size:100% 100%;}
.delFav-Cont{width:100%; padding:0 1.5rem; margin-top:2rem; font-size:.34rem; text-align: center;}
.delFav-Btn{width:100%; text-align: center; padding:0 .2rem; margin-top:.5rem;}
.delFav-Btn button{width:2.4rem;height:.75rem; border-radius:.38rem; border: none; font-size:.36rem; line-height:.75rem; color:#FFF; margin:0 .1rem;}
.delFav-Btn button.cancel{background:#c2c5cc;}
.delFav-Btn button.confirm{background:#00c87f;}


.del-enter-active{
    animation-name:bounceInUp;animation-duration:.5s;
}
.del-leave-active{
    animation-name:bounceOutDown;animation-duration:.5s;
}
.sel-enter-active{
    animation-name:flipInY;animation-duration:.5s;
}
.sel-leave-active{
    animation-name:flipOutY;animation-duration:.5s;
}
.tips-enter-active{
    animation-name:zoomIn;animation-duration:.5s;
}
.tips-leave-active{
    animation-name:zoomOut;animation-duration:.5s;
}



</style>
