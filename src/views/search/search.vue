<template>
    <div class="search">
        <div class="search-head">
            <span v-for="(item, index) in Artists.slice(0, 5)" :key="index" @click="clickHot(item.first)">
                {{item.first}}
            </span>
            <input type="text" v-model.trim="searchValue" class="search-input" placeholder="音乐/歌手" @keyup.enter="onEnter">
        </div>
        <MusicList
            :list="list"
            :listType="2"
            v-on:select="selectItem"
            :Height="60"
            :lockUp="lockUp"
            :scrollTo="scrollTo"
            @pullUpLoad="pullUpLoad"></MusicList>
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import MusicList from '../../components/music-list/Music-list.vue';
import api from '../../api/index.js';
import formatSongs from '../../utils/song.js';
export default {
    components: {
        MusicList
    },
    data() {
        return {
            lockUp: true,//是否上拉加载
            searchValue: '',//热搜关键词
            list: [],//搜索数组
            page: 0,//分页
            Artists: [],//热搜数组
            scrollTo: false
        }
    },
    watch: {
        // list(newValue, oldList){
        //     if (newValue.length !== oldList.length) {
        //         this.lockUp = false;
        //     } else if (
        //         newList[newList.length - 1].id !== oldList[oldList.length - 1].id
        //     ) {
        //         this.lockUp = false
        //     }
        // }
    },
    created() {
        api.searchHot().then((res) => {
            if (res.data.code === 200) {
                this.Artists = res.data.result.hots;
            }  
        }, (err) => { console.log('search' + err) })
    },
    methods: {
        onEnter(){
            if (this.searchValue.replace(/(^\s+)|(\s+$)/g, '') === '') {
                console.log('搜索内容不能为空')
                return;
            }
            this.page = 0;
            if (this.list.length > 0) {
                this.scrollTo = true;
            }
            api.search(this.searchValue, this.page).then(res => {
                if (res.data.code === 200) {
                    this.list = formatSongs(res.data.result.songs);
                }
            }, err => { console.log('seach' + err) })
        },
        /**
         * 滚动加载事件
         */
        pullUpLoad(){
            if (this.searchValue.replace(/(^\s+)|(\s+$)/g, '') === '') {
                console.log('搜索内容不能为空')
                return;
            }
            this.page += 1;
            api.search(this.searchValue, this.page).then(res => {
                if (res.status == 200) {
                    if (!res.data.result.songs) {
                        this.lockUp = false;
                        console.log('没有更多歌曲了')
                        return null;
                    }
                    this.list = [...this.list, ...formatSongs(res.data.result.songs)];
                    // console.log(this.list);
                }
            }, err => { console.log('seach' + err) })
        },
        selectItem(music){
            let image = this._getMusicDetail(music.id);
            music.image = image;
            this.selectAddPlay(music);
        },
        _getMusicDetail(id){
            return api.getMusicDetail(id).then(res => {
                if (res.data.code === 200) {
                    return res.data.songs[0].al.picUrl
                }
            })
        },
        clickHot(name){
            this.searchValue = name;
            this.onEnter();
        },
        ...mapMutations({
            setPlaying: 'SET_PLAYING',
        }),
        ...mapActions(['selectAddPlay'])
    },
    computed: {
        ...mapGetters(['playing', 'currentMusic'])
    },
}
</script>
<style lang="less">
    .search {
    position: relative;
    width: 100%;
    height: 100%;
    .search-head {
        display: flex;
        height: 40px;
        padding: 10px 15px;
        overflow: hidden;
        background: rgba(0,0,0,.2);
        span {
        line-height: 40px;
        margin-right: 15px;
        cursor: pointer;
        &:hover {
            color: #fff;
        }
        @media (max-width: 640px) {
            & {
            display: none;
            }
      }
    }
    .search-input {
      flex: 1;
      height: 40px;
      box-sizing: border-box;
      padding: 0 15px;
      border: 1px solid hsla(0,0%,100%,.6);
      outline: 0;
      background: transparent;
      color: #fff;
      font-size: 14px;
      box-shadow: 0 0 1px 0 #fff inset;
      &::placeholder {
        color: hsla(0,0%,100%,.6);
      }
    }
  }
}
</style>