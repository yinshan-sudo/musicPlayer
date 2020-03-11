<template>
    <div class="music-right">
        <template v-if="currentMusic.currentMusic.currentMusic">
             <dl class="music-info">
                <dt>
                    <img :src="currentMusic.currentMusic.musicImg" alt="" />
                </dt>
                <dd>歌曲名：{{currentMusic.currentMusic.songName}}</dd>
                <dd>歌手名：{{currentMusic.currentMusic.singer}}</dd>
                <dd>专辑：{{currentMusic.currentMusic.album}}</dd>
            </dl>
        </template>
        <template v-else>
            <dl class="music-info">
                <dt>
                    <img src="http://music.mtnhao.com/img/player_cover.373e0739.png" alt="">
                </dt>
                <dd>Vue音乐播放器</dd>
                <dd>皮皮虾</dd>
            </dl>
            <div class="music-lyric">

            </div>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    props: {
        currentMusic: {
            default: {}
        },
        mtnhao: {
            default: ''
        }
    },
    computed: {
        musicPicUrl(){
            return this.currentMusic.id
                ? `${this.currentMusic.image}?param=300y300`
                : require('../../assets/img/player_cover.png')
        },
        ...mapGetters(['currentMusic'])
    },
    mounted() {
        // console.log(this.currentMusic.currentMusic.currentMusic)
    },
}
</script>
<style lang="less">
    .music-right{
        position: relative;
        width: 310px;
        margin-left: 10px;
        height: 100%;
        .music-info{
            padding-bottom: 20px;
            text-align: center;
            font-size: 14px;
            dt{
                position: relative;
                width: 186px;
                height: 186px;
                margin: 0 auto 15px;
                img{
                    vertical-align: middle;
                    width: 186px;
                    height: 186px;
                }
                &:after{
                    content: "";
                    position: absolute;
                    left: 9px;
                    top: 0;
                    width: 201px;
                    height: 180px;
                    background: url('../../assets/img/album_cover_player.png') 0 0 no-repeat;
                }
            }
            dd{
                height: 30px;
                line-height: 30px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .music-lyric{
            position: absolute;
            top: 315px;
            right: 0;
            bottom: 0;
            left: 0;
            overflow: hidden;
            text-align: center;
        }
    }
</style>