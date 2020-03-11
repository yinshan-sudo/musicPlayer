import {  playMode  } from '../config.js';

const PLayerMusic = {
    initAudio(that){
        const ele = that.audioEle;
        /**
         * 音频缓冲事件
         */
        ele.onprogress = () => {
            try {
                if (ele.buffered.length > 0) {
                    const duration = that.currentMusic.duration;
                    let buffered = 0;
                    ele.buffered.end(0);
                    buffered = 
                        ele.buffered.end(0) > duration ? duration : ele.buffered.end(0);
                    that.currentProgress = buffered / duration;
                }
            } catch (error) {}
        }
        /**
         * 开始播放音乐
         */
        ele.onplay = () => {
            let timer;
            clearTimeout(timer);
            timer = setTimeout(() => {
                that.musicReady = true;
            }, 100);
        }
        /**
         * 获取当前时间
         */
        ele.ontimeupdate = () => {
            that.currentTime = ele.currentTime;
        },
        /**
         * 当前音乐播放完毕
         */
        ele.onended = () => {
            if (that.mode === playMode.loop)  {
                that.loop();
            } else {
                that.next();   
            }
        }
        /**
         * 音乐播放出错
         */
        ele.onerror = () => {
            console.log('当前音乐不可播放, 已自动播放下一首')
            that.next();
        }
        /**
         * 音乐进度拖动大于加载时重载音乐
         */
        ele.onstalled = () => {
            ele.load();
            that.setPlaying(false);
            let timer;
            clearTimeout(timer);
            timer = setTimeout(() => {
                that.setPlaying(true);
            }, 10);   
        }
        /**
         * 将能播放的音乐添加到播放历史
         */
        ele.oncanplay = () => {
            if (that.historyList.length === 0 || that.currentMusic.id !== that.historyList[0].id) {
                that.setHistory(that.currentMusic);
            }
        }
    },
}

export default PLayerMusic;