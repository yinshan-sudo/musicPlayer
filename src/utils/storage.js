import { defaultVolume } from '../config.js';

const _storage = window.localStorage;
const storage = {
    get(key, data = []){
        if (_storage) {
            return _storage.getItem(key) 
            ? Array.isArray(data)
                ? JSON.parse(_storage.getItem(key))
                : _storage.getItem(key)
            : data;
        }
    },
    set(key, val){
        if (_storage) {
            _storage.setItem(key, val);
        }
    },
    clear(key){
        if (_storage) {
            _storage.removeItem(key);
        }
    }    
}

/**
 * 播放长度
 * @type    HISTORYLISY KEY: key值
 *          HistoryListMax: 最大值
 */

const HISTORYLIST_KEY = '__player_historyList_';
const HistoryListMax = 200;

// 获取播放历史
export function getHistoryList(){
    return storage.get(HISTORYLIST_KEY)
}

// 更新播放历史
export function setHistoryList(music){
    let list = storage.get(HISTORYLIST_KEY);
    const index = list.findIndex(item => {
        return item.id === music.id;
    })
    if (index == 0) {
        return list;
    }
    if (index > 0) {
        list.splice(index, 1);
    }
    list.unshift(music);
    if (HistoryListMax && list.length > HistoryListMax) {
        list.pop();
    }
    storage.set(HISTORYLIST_KEY, JSON.stringify(list))
    return list;
}
// 删除一条播放历史
export function removeHistoryList(music){
    storage.set(HISTORYLIST_KEY, JSON.stringify(music));
    return music;
}
// 清空播放历史
export function clearHistoryList(){
    storage.clear(HISTORYLIST_KEY);
    return [];
}

/**
 * 播放模式
 * @type   MODE_KEY: key 值
 *         HistoryListMax: 最大长度
 */
const MODE_KEY = '__Player_mode_'
// 获取播放模式
export function getMode(){
    return storage.get(MODE_KEY, null);
}
export function setMode(mode){
    storage.set(MODE_KEY, mode);
    return mode;  
}


/**
 * 音量
 * @type VOLUME_KEY: KEY值
 */
const VOLUME_KEY = '__Player_volume_';
// 获取音量
export function getVolume(){
    const volume = storage.get(VOLUME_KEY, defaultVolume);
    return Number(volume);
}
// 修改音量
export function setVolume(volume){
    storage.set(VOLUME_KEY, volume);
    return volume;
}
