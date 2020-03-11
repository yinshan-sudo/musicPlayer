<template>
    <div class="details">
        <MusicList :list="list" @select="selectItem" :listType="listType"></MusicList>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import api from '../../api/index.js';
import { formatTopSongs } from '../../utils/song.js';
import MusicList from '../../components/music-list/Music-list.vue';
export default {
    name: 'Detail',
    data() {
        return {
            list: [],//列表
            listType: 2
        }
    },
    computed: {
        id(){
            return this.$route.params.id
        }
    },
    components: {
        MusicList
    },
    created() {
        
    },
    mounted() {
        // 获取歌单详情
        // console.log(this.$route.params);
        api.getPlaylistDetail(this.id).then((res) => {
            if (res.data.code === 200) {
                this.list = formatTopSongs(res.data.playlist.tracks)
            }
        }, (err) => { console.log('details:' + err) })
    },
    methods: {
        /**
         * 播放暂停
         */
        selectItem(item, index){
            this.selectPlay({
                list: this.list,
                index
            })
        },
        ...mapActions(['selectPlay'])
    },
}
</script>
<style lang="less">
    .details{
        .list-item{
            width: 100%;
            height: 50px;
            border-bottom: 1px solid hsla(0,0%,100%,.1);
            line-height: 50px;
            overflow: hidden;
            display: flex;
            .list-name{
                .list-menu{
                    .hover{
                        cursor: pointer;
                        display: none !important;
                    }
                }
            }
            
            &:hover{
                .list-time{
                    .iconfont{
                        display: block;
                    }
                }
            }
            &:hover{
                .list-name{
                    .list-menu{
                        .hover{
                            display: block !important;
                        }
                    }
                }       
            }
            &.list-header{
                span{
                    color: #fff;
                }
                .list-name{
                    flex: 1;
                    padding-left: 40px;
                    
                }
                .list-singer{
                    width: 150px;
                }
                .list-time{
                    width: 50px;
                }
                
            }
            
        }
    }
    
</style>