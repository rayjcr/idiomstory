<template>
<div class="wrap flexColumn">
    <div class="pageLoading">
        <img src="../assets/images/loding-240.gif"><br>
        <span>正在努力加载...</span>
    </div>
    
</div>
</template>

<script>
export default {
  name: 'blank',
  data(){
      return {

      }
     // return {currentView:'page_1'}
  },
  components:{    //这里是注册你所需要的组件的地方 上面import进来,这里注册
  },
  mounted:function(){
      if(this.$store.getters.getAllDone){
          this.$router.push({path:'home'})
      }
  },
  methods:{
        
  }
}
</script>

<style scoped>
    .wrap{ width:100%; height:100%; overflow: hidden; background:#fff;}
    .pageLoading{width:4.5rem; text-align: center; margin-left:1.5rem; margin-top:3rem;}
    .pageLoading img{width:50%;}
    .pageLoading span{font-size:.34rem; color:#999; padding-top:.5rem; display: inline-block;}
</style>
