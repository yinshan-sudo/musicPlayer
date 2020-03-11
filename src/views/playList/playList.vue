<template>
    <div class="play-list">
        <MusicList
        :list="playlist"
        v-on:select="selectItem"
        @del="deleteItem"
        ></MusicList>
    </div>
    
</template>
<script>
import MusicList from '../../components/music-list/Music-list.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
    components: {
        MusicList
    },
    computed: {
        ...mapGetters(['playing', 'playlist', 'currentMusic'])
    },
    methods: {
        // 播放暂停
        selectItem(item, index){
            if (item.id !== this.currentMusic.id) {
                this.setCurrentIndex(index);
                this.setPlaying(true);
            }
        },
        // 删除事件
        deleteItem(index){
            let list = [...this.playlist];
            list.splice(index, 1);
            this.removePlayListItem({list, index});
        },
        ...mapMutations({
            setPlaying: 'SET_PLAYING',
            setCurrentIndex: 'SET_CURRENTINDEX',
            clearPlaylist: 'CLEAR_PLAYLIST'
        }),
        ...mapActions(['removePlayListItem', 'clearPlayList'])
    },
}
</script>
<style lang="less">
@import '../../styles/music.less';
    // .list-item{
    //         width: 100%;
    //         height: 50px;
    //         border-bottom: 1px solid hsla(0,0%,100%,.1);
    //         line-height: 50px;
    //         overflow: hidden;
    //         display: flex;
    //         .list-name{
    //             .list-menu{
    //                 .hover{
    //                     cursor: pointer;
    //                     display: none !important;
    //                 }
    //             }
    //         }
            
    //         &:hover{
    //             .list-time{
    //                 .iconfont{
    //                     display: block;
    //                 }
    //             }
    //         }
    //         &:hover{
    //             .list-name{
    //                 .list-menu{
    //                     .hover{
    //                         display: block !important;
    //                     }
    //                 }
    //             }       
    //         }
    //         &.list-header{
    //             span{
    //                 color: #fff;
    //             }
    //             .list-name{
    //                 flex: 1;
    //                 padding-left: 40px;
                    
    //             }
    //             .list-singer{
    //                 width: 150px;
    //             }
    //             .list-time{
    //                 width: 50px;
    //             }
    //         }
            
    //     }

</style>