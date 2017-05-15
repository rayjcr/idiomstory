export default {
    set_IsTips(state,type){
        state.isTips = type._isShow;
        state.tipsTxt = type._value;
        state.callbackfc=type._callbackfc;
        //console.log(state.callbackfc);
    },
    set_TipsTxt(state,type){
        state.tipsTxt = type;
    },
    set_AllStory(state, data) {
        state.allStory = data;
        for(var i=0;i<state.allStory.length;i++){
		    state.allStory[i]["isHeart"]=false;
            state.allStory[i]["isCollection"]=false;
	    }
    },
    set_PraiseList(state, data) {
        state.praiseList = data;
    },
    set_CollectionList(state, data) {
        state.collectionList = data;
    },
    set_LearnedList(state, data) {
        state.learnedList = data;
    },
    set_CurStory(state, data) {
        state.curStory = data;
    },
    set_CurPage(state, data) {
        state.curPage = data;
    },
    set_HomeIndex(state, data) {
        state.homeIndex = data;
    },
    set_AllDone(state, data) {
        state.allDone = data;
    }, 
    set_CurScrollTop(state, data) {
        state.curScrollTop = data;
    }, 
    update_AllList(state, data) {
        //console.log(state.allStory);
    },
    set_IsPlay(state, data) {
        state.playPramas.isPlay = data.isPlay;
        state.playPramas.pid = data.pid;
        state.playPramas.playType = data.playType;
    },
    // set_TIsPlay(state, data) {
    //     state.tIsPlay = data;
    // },

    
 
}
