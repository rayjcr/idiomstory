<template>
    <div class="headers flexRow">
        <ul class="classification">
            <li v-bind:class="{active:activeIndex==0}" v-on:click="indexFn(0)"><span>全部</span></li>
            <li v-bind:class="{active:activeIndex==1}" v-on:click="indexFn(1)"><span>未学</span></li>
            <li v-bind:class="{active:activeIndex==2}" v-on:click="indexFn(2)"><span>已学</span></li>
        </ul>
        <div class="otherFun">
            <router-link :to="'search'">
                <div class="search"></div>
            </router-link>
            <router-link :to="'favorite'">
                <div class="favorite"></div>
            </router-link>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'headers',
  data(){
      return {activeIndex:0}
  },
  components:{
  },
  computed:mapGetters(['getHomeIndex']),
  watch:{
      getHomeIndex(data) {
        this.activeIndex =  data;
      },
  },
  methods:{
      indexFn(index){
          if(!localStorage.userToken&&index!=0){
                window.location.href="http://weixin.91118.com/index.html?openid="+ localStorage.userWid+"&url="+escape(window.location.href);
                }else{
          this.activeIndex =  index;
          this.$store.dispatch("setHomeIndex",index);
          this.$emit('changeActiveIndex',this.activeIndex);
          }
      }
  }
}
</script>

<style scoped>

    .headers{
        width:100%; height:.9rem;
        background:#fff;
        border-bottom:1px solid #e0e0e0;
        /*box-shadow:-2px 0 2px #aaa;*/
    }
    .classification{

    }
    .classification li{
        float:left;
        padding:0 .25rem;
        line-height:.9rem;
    }
    .classification li>span{
        display: inline-block;
        line-height:.9rem;
        height: .9rem;
        position:relative;
    }
    .classification li>span:after{
        content:'\20';
        width:0%;
        height:.04rem;
        border-radius:.02rem;
        background-color:#00abec;
        position: absolute;
        bottom:1px;
        left:0px;
        right: 0px;
        margin:0 auto;
        transition: .2s cubic-bezier(.6, 1.47, .64, .92);
    }
    .classification li.active>span:after{
        width:100%;
    }
    .classification li{
        font-size:.32rem;
    }
    .classification li.active{
        color:#00abec;
    }
    .otherFun{
        position: absolute;
        top:.25rem;
        right:.25rem;
        border-left:1px solid #e0e0e0;
        padding-left: .25rem;
        height:.4rem;
    }
    .otherFun .search{
        width:.4rem;
        height:.4rem;
        background:url(../../src/assets/images/dot-search.png) no-repeat;
        background-size:100% 100%;
        float: left;
    }
    .otherFun .favorite{
        width:.4rem;
        height:.4rem;
        background:url(../../src/assets/images/dot-fav.png) no-repeat;
        background-size:100% 100%;
        float: left;
        margin-left:.25rem;
    }
    

    

</style>
