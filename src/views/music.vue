<template>
  <div class="music">
    <div class="music-content">
      <div class="music-left">
        <MusicBtn></MusicBtn>
        <keep-alive>
            <router-view class="music-list" v-if="$route.meta.keepAlive" v-on:del="del"></router-view>    
        </keep-alive>
            <router-view class="music-list" v-if="!$route.meta.keepAlive" v-on:del="del"></router-view>
      </div>
      <lyric class="music-right" :lyric="lyric" :noLyric="noLyric" :lyric-index="lyricIndex" :picUrl="picUrl"></lyric>
    </div>
    <!-- <MusicBar></MusicBar> -->
    <!-- 播放器 -->
    <div class="music-bar" :class="{disable: !musicReady || currentMusic.id}" ref="musicBar">
      <div class="music-bar-btns" ref="musicBarBtn">
        <icon class="pointer"
        type="prev"
        :size="36"
        title="上一曲 Ctrl + Left"
        @click="prev"
        ></icon>
        <div class="control-play pointer" title="播放暂停 Ctrl + Space" @click="play">
          <icon :type="playing ? 'pause' : 'play'" :size="24"></icon>
        </div>
        <icon class="pointer"
        type="next"
        :size="36"
        title="下一曲 Ctrl + Right"
        @click="next"></icon>
      </div>
      <div class="music-music">
        <div class="music-bar-info">
          <template v-if="currentMusic && currentMusic.id">
            {{currentMusic.name}}
            <span> - {{currentMusic.singer}}</span>
          </template>
          <template v-else>
            欢迎使用音乐播放器
          </template>
        </div>
        <div
          v-if="currentMusic.id"
          class="music-bar-time"
        >{{currentTime | format}}/{{currentMusic.duration % 3600 | format}}</div>
        <MProgress class="music-progress"
        :percent="percentMusic"
        :percent-progress="currentProgress"
        v-on:progressChange="progressMusic"
        v-on:next="next"></MProgress>
      </div>
      <!-- 播放模式 -->
      <icon
        class="icon-color pointer mode"
        :type="getModeIconType()"
        :title="getModeIconTitle()"
        :size="30"
        v-on:click="modeChange"></icon>
      <!-- 评论 -->
      <icon 
        class="icon-color pointer comment"
        type="comment"
        :size="30"
        v-on:click="openComment"></icon>
      <!-- 音量控制 -->
      <div class="music-bar-volume" title="音量加减 [Ctrl + Up / Down]">
        <volume :volume="volume" v-on:volumeChange="volumeChange"></volume>
      </div>
    </div>
    <div class="play-bg" ref="playBg" :style="{ 'backgroundImage': 'url(' + playBg+')' }"></div>
    <div class="play-mask"></div>
  </div>
</template>
<script>
import api from '../api/index.js';
import { randomSortArray, parseLyric, format } from '../utils/util.js';
import { playMode, defaultBG } from '../config.js';
import { getVolume, setVolume } from '../utils/storage.js';
import { mapActions, mapMutations, mapGetters } from 'vuex'
import MusicRight from '../components/musicContent/MusicRight.vue';
import Lyric from '../components/lyric/lyric.vue';
import MusicBar from '../components/musicBar/MusicBar.vue';
import MProgress from '../base/progress/mprogress.vue';
import volume from '../components/volume/volume.vue';
import MusicBtn from '../components/music-btn/Music-btn.vue';
import PlayMusic from './Player.js';
export default {
    components: {
        MusicRight,
        MusicBar,
        Lyric,
        MProgress,
        volume,
        MusicBtn
    },
    filters: {
      format
    },
    data() {
        const volume = getVolume();
        return {
            musicReady: false,//是否可以使用播放器
            currentTime: 0,//当前播放时间
            currentProgress: 0,//当前缓冲进度
            lyric: [],//歌词
            noLyric: false,//是否有歌词
            lyricIndex: 0,//当前播放歌词的下标
            isMute: false,//是否静音
            volume,//音量大小
            picUrl: `${require('../assets/img/player_cover.png')}`,
            playBg: 'http://cdn.mtnhao.com/music/bg.jpg'
        }

    },
    computed: {
        percentMusic(){
            const duration = this.currentMusic.duration
            return this.currentTime && duration ? this.currentTime / duration : 0;
        },
        ...mapGetters([
            'audioEle',
            'mode',
            'playing',
            'playlist',
            'orderList',
            'currentIndex',
            'currentMusic',
            'historyList'
        ])
    },
    watch: {
        currentMusic: {
          handler(newMusic, oldMusic){
            if (!newMusic.id) {
                this.lyric = [];
                return;
            }
            if (newMusic.id === oldMusic.id) {
                return;
            }
            if (newMusic.id && newMusic.image) {
              // console.log(newMusic.image);
              this.$nextTick(() => {
                let url = newMusic.image;
                if (typeof newMusic.image == 'object') {
                  console.log(newMusic);
                  newMusic.image.then(res => {
                    url = res;
                  })
                }
                setTimeout(() => {
                  this.picUrl = url;
                  this.$refs.playBg.style.backgroundImage = `url(${url})`
                }, 500)
              })
            }
            this.audioEle.src = newMusic.url;
            // 重置相关参数
            this.lyricIndex = this.currentTime = this.currentProgress = 0;
            this.audioEle.play();
            this.$nextTick(() => {
              this._getLyric(newMusic.id);  
            }) 
          },
          immediate: true,
          deep: true
        },
        playing(newPlaying){
          const audio = this.audioEle;
          this.$nextTick(() => {
            newPlaying ? audio.play() : audio.pause();
            this.musicReady = true;
          })
        },
        currentTime(newTime){
          if (this.noLyric) {
            return;
          }
          let lyricIndex = 0;
          for (let i = 0; i < this.lyric.length; i++) {
            if(newTime > this.lyric[i].time){
              lyricIndex = i;
            }            
          }
          this.lyricIndex = lyricIndex;
        }
    },
    methods: {
      /**
       * 键盘事件
       */
      initKeyDown(){
        document.onkeydown = e => {
          switch (e.ctrlKey && e.keyCode) {
            case 32: //播放暂停 Ctrl + Space
              this.play();
              break;
            case 37: //上一首 Ctrl + left
              this.prev();
              break;
            case 38: //音量加 Ctrl + Up
              let plus = Number((this.volume += 0.1).toFiexd(1));
              if(plus > 1){
                plus = 1; 
              }
              break;
            case 39: //下一首 Ctrl + right
              this.next();
              break;
            case 40: // 音量Ctrl + Down
              let reduce = Number((this.volume -= 0.1).toFixed(1));
              if (reduce < 0) {
                reduce = 0;
              }
              this.volumeChange(reduce)
              break;
            case 79:  //切换播放模式
              this.modeChange();
              break;
          }
        }
      },
      /**
       * 上一首
       */
      prev(){
        if (!this.musicReady) {
          return 
        }
        if (this.playlist.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex - 1;
          if (index < 0) {
            index = this.playlist.length - 1;
          }
          this.setCurrentIndex(index);
          if (!this.playing && this.musicReady) {
            this.setPlaying(true);
          }
          this.musicReady = false;
        }
      },
      /**
       * 播放暂停
       */
      play(){
        if (!this.musicReady) {
          return 
        }
        this.setPlaying(!this.playing);
      },
      /**
       * 下一首
       */
      next(){
        if (!this.musicReady) {
          return 
        }
        if (
          this.playlist.length - 1 === this.currentIndex &&
          this.mode === playMode.order
        ) {
          this.setCurrentIndex(-1);
          this.setPlaying(false); 
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1;
          if (index === this.playlist.length) {
            index = 0;
          }
          if (!this.playing && this.musicReady) {
            this.setPlaying(true);
          }
          this.setCurrentIndex(index);
          this.musicReady = false;
        }
      },
      /**
       * 循环
       */
      loop(){
        this.audioEle.currentTime = 0;
        this.audioEle.play()
        this.setPlaying(true);
        if (this.lyric.length > 0) {
          this.lyricIndex = 0;
        }
      },
      /**
       * 修改音乐进度
       */
      progressMusic(percent){
        this.audioEle.currentTime = this.currentTime.duration * percent;
      },
      /**
       * 获取播放模式 icon
       */
      getModeIconType(){
        return {
          [playMode.listLoop]: 'loop',
          [playMode.order]: 'sequence',
          [playMode.random]: 'random',
          [playMode.loop]: 'loop-one',
        }[this.mode];
      },
      /**
       * 修改音量大小
       */
      volumeChange(percent){
        // percent === 0 ? (this.isMute = true) : (this.isMute = false);
        // this.volume = percent;
        // this.audioEle.volume = percent;
        // setVolume(percent);
      },
      /**
       * 打开音乐评论
       */
      openComment(){
        if (!this.currentMusic.id) {
          console.log('没有播放音乐')
          return false;
        }
        let router = this.$route.path;
        if (router.indexOf('/music/comment') != -1) {//判断要跳转的路由是否是当前路由
          return;
        }
        this.$router.push(`/music/comment/${this.currentMusic.id}`)
      },
      /**
       * 切换播放顺序
       */
      modeChange(){
        const mode = (this.mode + 1) % 4;
        this.setPlayMode(mode);
        if (mode == playMode.loop) {
          return;
        }
        let list = [];
        switch (mode) {
          case playMode.listLoop:
          case playMode.order:
            list = this.orderList;
            break;
          case playMode.random:
            list = randomSortArray(this.orderList);
            break;
        }
        this.resetCurrentIndex(list);
        this.setPlaylist(list);
      },
      /**
       * 修改当前歌曲索引 
       */
      resetCurrentIndex(list){
        const index = list.findIndex(item => {
          return item.id === this.currentMusic.id;
        })
        this.setCurrentIndex(index);
      },
      /**
       * 获取播放模式 title
       */
      getModeIconTitle(){
        const key = 'Ctrl + O'
        return {
          [playMode.listLoop]: `列表循环 ${key}`,
          [playMode.order]: `顺序播放 ${key}`,
          [playMode.random]: `随机播放 ${key}`,
          [playMode.loop]: `单曲循环 ${key}`
        }[this.mode];
      },
      /**
       * 获取歌词
       */
      _getLyric(id){
        api.getLyric(id).then((res) => {
          if (res.status == 200) {
            if (res.data.nolyric) {
              this.nolyric = true;
            } else {
              this.nolyric = false;
              this.lyric = parseLyric(res.data.lrc.lyric);
            }
            this.audioEle.play();
          }
        }, (err) => {
          console.log(err);
        })
      },
      /**
       * 删除歌曲
       */
      del(index){
        console.log(index);
      },
      ...mapMutations({
        setPlaying: 'SET_PLAYING',
        setPlaylist: 'SET_PLAYLIST',
        setCurrentIndex: 'SET_CURRENTINDEX'
      }),

      ...mapActions(['setHistory', 'setPlayMode'])
    },
    mounted() {
      this.$nextTick(() => {
        PlayMusic.initAudio(this);
        this.initKeyDown();
        this.volumeChange(this.volume);
      })      
      // console.log(this.$refs.musicBar, this.$refs.musicBarBtn)
    },
    updated() {
        // console.log(this.currentMusic.id );
      
    },
    
}
</script>
<style lang="less">
.music {
  .music-content {
    display: flex;
    width: 100%;
    height: calc(100% - 80px);
  }
  .music-bar {
    width: 100%;
    height: 80px;
    padding-bottom: 20px;
    box-sizing: border-box;
    display: flex;
    color: #fff;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .play-bg,
  .play-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .play-bg {
    z-index: -2;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    transform: translateZ(0);
    transition: all 0.8s;
  }
  .play-mask {
    z-index: -1;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .icon-color {
    margin-left: 20px;
  }
}
.music-left{
        flex: 1;
        height: 100%;
        overflow: hidden;
        .music-list{
            width: 100%;
            height: calc(100% - 60px);
        }
    }
</style>
