<template>
  <div id="app">
    <MHeader></MHeader>
    <router-view class="router-view"></router-view>
    <audio ref="Player"></audio>
    <!-- <Dialog v-if="isShow"></Dialog> -->
  </div>
</template>
<script>
import MHeader from "./components/header/Header.vue";
// import Dialog from "./components/login/Dialog.vue";
import { defaultSheetId } from './config.js';
import { createTopList } from './utils/song.js';
import api from './api/index.js';
import { mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      playSrc: '',
      
    }
  },
  computed: {
    
  },
  methods: {
    // 歌曲处理
    _formatSongs(list){
      let ret = [];
      list.forEach(item => {
        const musicData = item;
        if (musicData.id) {
          ret.push(createTopList(musicData))
        }
      })
      return ret;
    },
    ...mapMutations({
      setAudioEle: 'SET_AUDIOELE'
    }),
    ...mapActions(['setPlaylist'])
  },
  mounted() {
    api.getPlaylist(defaultSheetId).then(res => {
      if (res.status == 200) {
        let list = this._formatSongs(res.data.playlist.tracks.slice(0, 100));
        this.setPlaylist({ list });
      }
    })
    // 设置audio元素
    this.$nextTick(() => {
      this.setAudioEle(this.$refs.Player);
      // console.log(this.$store.state.audioEle);

    })
    
    window.audio = this.$refs.Player;
  },
  watch: {
    
  },
  components: {
    MHeader
  }
};
</script>
<style lang="less">
@import "./assets/app.less";
</style>
