import * as types from './mutation-types.js';
const mutations = {
    //修改audio元素
    [types.SET_AUDIOELE](state, audioEle){
        state.audioEle = audioEle;
    },
    //修改播放模式
    [types.SET_PLAYMODE](state, mode){
        state.mode = mode;
    },
    // 修改播放状态
    [types.SET_PLAYING](state, playing){
        state.playing = playing;
    },
    // 修改播放列表
    [types.SET_PLAYLIST](state, playlist){
        state.playlist = playlist;
    },
    // 修改顺序列表
    [types.SET_ORDERLIST](state, orderList){
        state.orderList = orderList;
    },
    // 修改当前音乐索引
    [types.SET_CURRENTINDEX](state, currentIndex){
        state.currentIndex = currentIndex;
    },
    // 修改播放历史列表
    [types.SET_HISTORYLIST](state, historyList){
        state.historyList = historyList;
    },

}

export default mutations;