<template>
    <div>
        <!-- 封面 -->
        <dl class="music-info">
            <dt>
                <img :src="picUrl" alt="">
            </dt>
            <template v-if="currentMusic.id">
                <dd>歌曲名：{{currentMusic.name}}</dd>
                <dd>歌手名：{{currentMusic.singer}}</dd>
                <dd>专辑名：{{currentMusic.album}}</dd>
            </template>
            <template v-else>
                <dd>Vue音乐播放器</dd>
                <dd>
                    <a href="https://vuex.vuejs.org/zh/" target="_blank" >
                        <icon type="github" :size="14">vue</icon>
                    </a>
                </dd>
            </template>
        </dl>
        <div ref="musicLyric" class="music-lyric">
            <div class="music-lyric-items" :style="lyricTop">
                <p v-if="!currentMusic.id">没有播放音乐哦！</p>
                <p v-else-if="noLyric">暂无歌词</p>
                <template v-else-if="lyric.length > 0">
                    <p v-for="(item, index) in lyric" :key="index" :class="{on:lyricIndex == index}">
                        {{item.text}}
                    </p>
                </template>
                <p v-else>
                    歌词加载失败
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            top: 0,//歌词居中
        }
    },
    props: {
        lyric: {
            type: Array,
            default: () => []
        },
        // 是否无歌词
        noLyric: {
            type: Boolean,
            default: false
        },
        // 当前歌词下标
        lyricIndex: {
            type: Number,
            default: 0
        },
        picUrl: {
            type: String,
            default: ''
        }
    },
    computed: {
        musicPicUrl(){
            return this.currentMusic.id 
            ?`${this.currentMusic.image}?param=300y300)`
            : require('../../assets/img/player_cover.png')
        },
        lyricTop(){
            return `transform: translate3d(0, ${-34 * (this.lyricIndex - this.top)}px, 0)`;
        },
        ...mapGetters(['currentMusic'])
    },
    mounted() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer)
            this.resizeTimer = setTimeout(() => this.clacTop(), 60)
        })
        this.$nextTick(() => this.clacTop());
    },
    updated() {
        // console.log(this.currentMusic.image);
    },
    methods: {
        clacTop(){
            const dom = this.$refs.musicLyric;
            const { display = '' } = window.getComputedStyle(dom);
            if (display == 'none') {
                return;
            }
            const height = dom.offsetHeight;
            this.top = Math.floor(height / 34 / 2);
        }
    },
}
</script>
<style lang="less" scoped>
    .music-info {
        padding-bottom: 20px;
        text-align: center;
        // font-size: @font_size_medium;
        font-size: 14px;
        dt {
            position: relative;
            width: 186px;
            height: 186px;
            margin: 0 auto 15px;
            &:after {
                content: '';
                position: absolute;
                left: 9px;
                top: 0;
                width: 201px;
                height: 180px;
                background: url('../../assets/img/album_cover_player.png') 0 0 no-repeat;
            }
            img {
                vertical-align: middle;
                width: 186px;
                height: 186px;
            }
        }
        dd {
            height: 30px;
            line-height: 30px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            a{
                color: hsla(0,0%,100%,.6);
            }
        }
}

/*歌词部分*/
.music-lyric {
    position: absolute;
    top: 315px;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    text-align: center;
    -webkit-mask-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.6) 15%,
        rgba(255, 255, 255, 1) 25%,
        rgba(255, 255, 255, 1) 75%,
        rgba(255, 255, 255, 0.6) 85%,
        rgba(255, 255, 255, 0) 100%
    );
    .music-lyric-items {
        text-align: center;
        line-height: 34px;
        // font-size: @font_size_small;
        transform: translate3d(0, 0, 0);
        transition: transform 0.6s ease-out;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        .on {
            color: #fff;
        }
    }
}
</style>