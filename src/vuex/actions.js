import $ from 'jquery'
import Vue from 'vue'
import VueResource from 'vue-resource'  //vue资源插件
import CryptoJS from 'crypto-js/core';
import MD5 from 'crypto-js/md5';
import store from '../vuex/store.js'
Vue.use(VueResource);

export const setIsTips = function({commit},type){
    commit("set_IsTips",type)
}
export const setTipsTxt = function({commit},type){
    commit("set_TipsTxt",type)
}
export const setCurPage = function({commit},type){
    commit("set_CurPage",type)
}
export const setCurStory = function({commit},type){
    commit("set_CurStory",type)
}
export const setAllDone = function({commit},type){
    commit("set_AllDone",type)
}
export const setCurScrollTop = function({commit},type){
    commit("set_CurScrollTop",type)
}

export const setHomeIndex = function({commit},type){
    commit("set_HomeIndex",type)
}

export const setIsPlay = function({commit},type){
    commit("set_IsPlay",type)
}

// export const setTIsPlay = function({commit},type){
//     commit("set_TIsPlay",type)
// }

// export const update_heart = function({commit},paramObj){
//     commit("update_Heart",type)
// }

// export const update_collection = function({commit},paramObj){
//     commit("update_Collection",type)
// }


//点赞
export const click_heart = function({commit},paramObj){
    return new Promise((resolve, reject) => {
        //var allList = paramObj.thisobj.$store.getters.getAllStory;
        var pid = paramObj.pid;
        var that = paramObj.thisobj;       
        that.$store.dispatch("setAddPraise",pid).then(response => {
            var _index = _.findIndex(that.allList,{'Id':pid});
            var _cindex = _.findIndex(that.curList,{'Id':pid});
            that.allList[_index].isHeart=true;
            that.allList[_index].PraiseNum = that.allList[_index].PraiseNum +1;
            
            var video=response.Video;
            video.isHeart=true;
            video.isCollection=that.curList[_cindex].isCollection;
            that.$set(that.curList,_cindex,video)
            that.$store.dispatch("setIsTips",{"_isShow":true,"_value":"点赞成功"});
        }, response => {
            console.log("数据读取错误,刷新下重试");
        })

    })  
}


//收藏
export const chick_collection = function({commit},paramObj){
    return new Promise((resolve, reject) => {        
        var pid = paramObj.pid;
        var that = paramObj.thisobj;        
        that.$store.dispatch("setAddCollection",pid).then(response => {
            var _index = _.findIndex(that.allList,{'Id':pid});
            var _cindex = _.findIndex(that.curList,{'Id':pid});
            that.allList[_index].isCollection = true;            
            that.allList[_index].CollectionNum = that.allList[_index].CollectionNum +1;
            //更新curList
            var video=response.Video;
            video.isCollection=true;
            video.isHeart=that.curList[_cindex].isHeart;
            that.$set(that.curList,_cindex,video);
            /////更新收藏
            var favoriteList =paramObj.thisobj.$store.getters.getCollectionList;           
            favoriteList.push(response.CollectionLog);
            //更新allList
           // store.dispatch("updateAllList",{"_index":_index});
            that.$store.dispatch("setIsTips",{"_isShow":true,"_value":"收藏成功"});
        }, response => {
            console.log("数据读取错误,刷新下重试");
        })
    })  
}


//得到微信验证信息
export const VerificationW = function({commit},type){  
    return new Promise((resolve, reject) => {
        Vue.http.get('//weixin.91118.com/api/user/getwxbindinfo',{params:{"openId":type.Wid}}).then(function(response){           
            resolve(response.body);
        }, function(response){
            console.log(response)
        });
    })  
}


//得到用户Token
export const getUserToken = function({commit},type){  
    return new Promise((resolve, reject) => {
        Vue.http.get('//idiomstory.91sst.com/api/Service/GetToken',{params:{"staffId":type.uid,"gradid":type.gid}}).then(function(response){            
            resolve(response.body);
        }, function(response){
            console.log(response)
        });
    })  
}

//得到所有成语故事的数据
export const getCyJson = function({commit}){
    return new Promise((resolve, reject) => {        
        Vue.http.get('//idiomstory.91sst.com/api/Video/Get').then(function(response){            
            commit('set_AllStory', response.body);
            resolve(response.body);
        }, function(response){
            console.log(response)
        });
    })
}

//得到已学习记录的数据
export const getLearnedList = function({commit}){
    return new Promise((resolve, reject) => {
        var _params = {"bid":"1"};   
        Vue.http.get('//idiomstory.91sst.com/api/WacthLog/Get',{params:_params}).then(function(response){
            commit('set_LearnedList', response.body);
            resolve(response.body);
        }, function(response){
            console.log(response)
        });
    })
}

//添加已学习完成记录
export const setLearned = function({commit},vid){
    return new Promise((resolve, reject) => {
        var _params = "="+vid;      
        var allList = store.getters.getAllStory;
        Vue.http.post('//idiomstory.91sst.com/api/WacthLog/Post',_params).then(function(response){
            var _index = _.findIndex(allList,{'Id':vid});
            ///更新视频源
            var video=response.body.Video;
             video.isCollection=allList[_index].isCollection;
             video.isHeart=allList[_index].isHeart;
             Vue.set(allList,_index,video);
             /////更新学习过的list
             var learnedList = store.getters.getLearnedList;
             var _windex = _.findIndex(learnedList,{'videoid':vid});
            // learnedList.push(response.body.WacthLog);
            Vue.set(learnedList,_windex,response.body.WacthLog);

            resolve(response.body);
        }, function(response){
            console.log(response)
        });
    })
}

//添加赞信息
export const setAddPraise = function({commit},vid){
    return new Promise((resolve, reject) => {
        var _params = "="+vid;  
        Vue.http.post('//idiomstory.91sst.com/api/Praise/AddLog',_params).then(function(response){ 
            resolve(response.body);
        }, function(response){
            console.log(response)
        });
    })
}
//删除赞信息
// export const setDelPraise = function({commit},vid){
//     return new Promise((resolve, reject) => {
//         var _params = "="+vid;
//         var encryObj = _encrypted(_params,2);
//         Vue.http.post('//idiomstory.91sst.com/api/Praise/DelLog',_params).then(function(response){
//             //commit('set_AllStory', response.body);
//             //console.log(response.body);
//             resolve(response.body);
//         }, function(response){
//             console.log(response)
//         });
//     })
// }

//添加收藏信息
export const setAddCollection = function({commit},vid){ 
    return new Promise((resolve, reject) => {
        var _params = "="+vid;  
        Vue.http.post('//idiomstory.91sst.com/api/Collection/AddLog',_params).then(function(response){       
            resolve(response.body);
        }, function(response){
            console.log(response)
        });
    })
}
//批量删除收藏信息
export const setDelCollection = function({commit},vids){
    return new Promise((resolve, reject) => {
        var _params ="="+_.join(vids,',');
        Vue.http.post('//idiomstory.91sst.com/api/Collection/DelLogs',_params).then(function(response){
           var allList = store.getters.getAllStory;
           /////更新视频信息
                response.body.forEach(function(element) {
                var _index = _.findIndex(allList,{'Id':element.Id});
                var video=element;
                video.isCollection=false;
                video.isHeart=allList[_index].isHeart;
                Vue.set(allList,_index,video);    
                }, this);
            ///////更新收藏列表
            var favoriteList =store.getters.getCollectionList;           
            _.remove(favoriteList, function(n) {return _.findIndex(vids, function(o) { return o ==n.videoid ; })>-1;});
            resolve(response.body);
        }, function(response){
            console.log(response)
        });
    })
}




//获取所有赞的数据
export const getAllPraise = function({commit}){
    return new Promise((resolve, reject) => {
        var _params = {"bid":"1"};
        var encryObj = _encrypted(_params,1);
        Vue.http.get('//idiomstory.91sst.com/api/Praise/Get',{params:_params}).then(function(response){
            commit('set_PraiseList', response.body);
            resolve(response.body);
        }, function(response){
            console.log(response)
            resolve("err")
        });
    })
}

//获取所有收藏的数据
export const getAllCollection = function({commit}){
    return new Promise((resolve, reject) => {
        var _params = {"bid":"1"};
        var encryObj = _encrypted(_params,1);
        Vue.http.get('//idiomstory.91sst.com/api/Collection/Get',{params:_params}).then(function(response){
            commit('set_CollectionList', response.body);
            resolve(response.body);
        }, function(response){
            console.log(response)
            resolve("err")
        });
    })
}

//获取搜索数据
export const getSearchData = function({commit}){
    return new Promise((resolve, reject) => {
        var _params = {"bid":"1"};
        var encryObj = _encrypted(_params,1);
        Vue.http.get('//idiomstory.91sst.com/api/Seach/Get',{params:_params}).then(function(response){
            //commit('set_AllStory', response.body);
            resolve(response.body);
        }, function(response){
            console.log(response)
            resolve("err")
        });
    })
}

//获取用户年纪观看最多的视频
export const getTopWacth = function({commit}){
    return new Promise((resolve, reject) => {
        var _params = {"bid":"1"};
        var encryObj = _encrypted(_params,1);
        Vue.http.get('//idiomstory.91sst.com/api/WacthLog/GetTopWacth',{params:_params}).then(function(response){
            //commit('set_AllStory', response.body);
            resolve(response.body);
        }, function(response){
            console.log(response)
            resolve("err")
        });
    })
}

//保存搜索结果视频
export const setSearchData = function({commit},vid){
    return new Promise((resolve, reject) => {
        var _params = "="+vid;
        var encryObj = _encrypted(_params,1);
        Vue.http.post('//idiomstory.91sst.com/api/Seach/Post',_params).then(function(response){
            //commit('set_AllStory', response.body);
            resolve(response.body);
        }, function(response){
            console.log(response)
            resolve("err")
        });
    })
}

//http://idiomstory.91sst.com/api/Seach/Post



//更新allList
// export const updateAllList = function({commit},type){
//     commit("update_AllList",type)
// }


//生成加密对象
function _encrypted(params,type){
    var encryptObj={};
    if(localStorage.userToken){
        var userToken = JSON.parse(localStorage.userToken);
        var timestamp=Math.round(new Date().getTime())+"";
        var nonceValue=Math.random()+"";
        var params_user = params;
        var params_const = timestamp + nonceValue + userToken.StaffId+ userToken.SignToken;
        encryptObj["userToken"] = userToken;
        encryptObj["timestamp"] = timestamp;
        encryptObj["nonce"] = nonceValue;
        encryptObj["signature"] = _toMd5(params_user,params_const,type);
        return encryptObj;}else{

        return false;
    }
}

//MD5加密
function _toMd5(a_arr,b_str,type){
    var tempstr = "";
    if(type=="GET"){
        var sa_arr=Object.keys(a_arr).sort();
        for(var i=0; i<sa_arr.length;i++){
            tempstr =  tempstr + sa_arr[i]+a_arr[sa_arr[i]];
        }
    }else if(type=="POST"){ 
        tempstr =a_arr;
    }
    //加密数据正向排序
    var rutStr = b_str+tempstr;
    var rutStr_a=rutStr.split("");
    rutStr_a.sort();              
    var rutStr_b=rutStr_a.join("");
    // console.log(b_str+tempstr);
    return CryptoJS.MD5(rutStr_b).toString().toUpperCase();
}

//验证返回是否返回错误
function _VerificationError(response)
{
    if(response.body.StatusCode)
    {
        return  false;
    }else{
        return  true;
    }
}
//Vue.http.options.emulateJSON = true;
//vue-resource拦截器...对于提交前和提交后进行逻辑处理
Vue.http.interceptors.push(function(request, next) {   
    var params=request.method=="GET"?request.params:request.body;    
    var encryObj= _encrypted(params,request.method)
    if(encryObj){
        request.headers.map={"staffid":[encryObj.userToken.StaffId],"gradid":[encryObj.userToken.Gradid],"timestamp":[encryObj.timestamp],"nonce":[encryObj.nonce],"signature":[encryObj.signature]};
    }
    if(request.method=="POST"){   
        request.headers.map["Content-Type"]=["application/x-www-form-urlencoded"];       
    }   
    next(function(response) {
        if(_VerificationError(response))
        {
            return response;
        }else{
            //  store.dispatch("setIsTips",{"_isShow":true,"_value":"请登录。","_callbackfc":function()
            //  { 
                window.location.href="http://weixin.91118.com/index.html?openid="+ localStorage.userWid+"&url="+escape(window.location.href);
        //      }
        // });
            
            response.ok=false;
            ///终止请求返回     
        }
    })
})





