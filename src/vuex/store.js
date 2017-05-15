import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex);

const state = {
    isTips:false,
    tipsTxt:"",
    callbackfc:"",
    curPage:0,         //主页中，当前第几页
    allStory:[],
    curStory:[],
    praiseList:[],
    collectionList:[],
    learnedList:[],
    homeIndex:0,     //home页的index 分别指向all,learned,nolearned
    allDone:false,   //所有初始化数据加载完毕的标识
    curScrollTop:0,  //记录当前滚动条位置
    playPramas:{
      isPlay:false,
      pid:0,
      playType:""
    },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})