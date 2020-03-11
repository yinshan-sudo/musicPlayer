<template>
    <div class="musicList"  v-if="list.length !== 0" >
        <div class="list-item list-header">
            <span class="list-name">歌曲</span>
            <span class="list-singer">歌手</span>
            <span class="list-time" v-if="listType === 1">时长</span>
            <span class="list-album" v-else>专辑</span>
        </div>
        <vue-scroll detectResize :ops="ops" ref="vs" @handle-scroll="handleScroll" :style="height()">
        <div class="list-content">
            <div class="list-item" v-for="(item, index) in list" :key="index">
                <span class="list-num">{{index + 1}}</span>
                <div class="list-name">
                    <span >{{item.name}}</span>
                    <div class="list-menu">
                        <icon 
                            class="hover"
                            :type="getPlayIconType(item)"
                            :size="40"
                            @click.stop="selectItem(item, index, $event)"
                        />
                    </div>
                </div> 
                <span class="list-singer">
                    {{item.singer}}
                </span>
                <span class="list-time" v-if="listType === 1">
                    <span ref="time">{{time(item.duration)}}</span>
                    <i class="iconfont icon-delete-mini hover" @click="delectItem(index)"></i>
                </span>
                <span class="list-album" v-else>
                    {{item.album}}
                </span>
            </div>
        </div>
    </vue-scroll>
    </div>
    
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
    data() {
        return {
            ops: {//滚动条配置
                bar: {
                    keepShow: true,
                    background: 'rgb(168, 172, 171)',
                    minSize: 0.1,
                    disable: false//是否禁用滚动条
                },
                rail: {
                    opacity: 0.3,
                    background: 'rgb(0, 0, 0)'
                }
            },
        }
    },
    computed: {
        ...mapGetters(['playing', 'currentMusic']),
        
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        // 歌曲数据
        list: {
            type: Array,
            default: () => []
        },
        lockUp: {
            type: Boolean,
            default: false
        },
        listType: {
            type: Number,
            default: 1
        },
        Height: {
            type: Number,
            default: 0
        },
        scrollTo: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        list(newValue){
            if (newValue) {
                // this.ops.bar.disable = false;
                this.ops.bar.keepShow = true;

            }
        },
        lockUp(newValue){
            if (!newValue) {
                // this.ops.bar.disable = false;
                this.ops.bar.keepShow = true;
            }
        },
        scrollTo(newValue){
            if (newValue) {
                this.$refs['vs'].scrollTo(
                    {
                        y: 0
                    },
                )
            }
        }
    },
    methods: {
        /**
         * 上拉加载事件
         */
        handleScroll(vertical, horizontal, nativeEvent){
            if (this.lockUp && vertical.process > 0.95) {
                // this.ops.bar.disable = true;
                this.ops.bar.keepShow = false;
                this.$emit('pullUpLoad');
                console.log(vertical.scrollTop);
                // vertical.process = 0.5;
                // console.log();
                // this.$refs['vs'].scrollTo(
                //     {
                //         y: vertical.scrollTop
                //     },
                // )
            }
        },
        height(){
            return `height: calc(100% - 50px - ${this.Height}px)`
        },
        time(num){
            var Minute = parseInt(num / 60);
            var Second = parseInt(num - Minute * 60);
            Minute = Minute < 10 ? '0' + Minute : Minute + '';
            Second = Second < 10 ? '0' + Second : Second + '';
            var time = Minute + ":" + Second;
            return time;
        },
        selectItem(item, index, e){
            if (this.currentMusic.id && item.id === this.currentMusic.id) {
                this.setPlaying(!this.playing)
                return;
            }
            this.$emit('select', item, index);
        },
        delectItem(index){
            this.$emit('del', index);
        },
        getPlayIconType({id: itemId}){
            // console.log(this.currentMusic);
            const {
                playing,
                currentMusic: { id },
            } = this;
            return playing && id === itemId ? 'pause-mini' : 'play-mini';
        },
        ...mapMutations({
            setPlaying: 'SET_PLAYING'
        })
    },
    mounted() {

    },
    // updated(){
    //     console.log(this.list);
    // }
}
</script>
<style lang="less" scoped>
@import '../../styles/music.less';
.musicList{
    height: 100%;
    .list-header.list-item{
        .list-singer{
            width: 300px;
        }
        .list-album{
                width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
    }
}
    .list-content{
            width: 100%;
            >div{
                width: calc(100% - 6px);
            }
            .list-num{
                display: block;
                width: 30px;
                margin-right: 10px;
                text-align: center;
            }
            .list-name{
                flex: 1;
                display: flex;
                position: relative;
                >span{
                    width: 100%;
                }
                .list-menu{
                    position: absolute;
                    right: 10px;
                    height: 50px;
                    .iconfont{
                        display: inline-block;
                        font-style: normal;
                        font-weight: 400;
                        font-variant: normal;
                        line-height: 50px;
                        vertical-align: baseline;
                        text-transform: none;
                        speak: none;
                        font-size: 40px;
                        -webkit-font-smoothing: antialiased;
                        &:hover{
                            color: #fff;
                        }
                    }
                }
            }
            .list-singer{
                    width: 300px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            .list-time{
                position: relative;
                width: 50px;
                i{
                    position: absolute;
                    display: none;
                    font-style: normal;
                    font-weight: 400;
                    font-variant: normal;
                    line-height: 50px;
                    vertical-align: baseline;
                    text-transform: none;
                    speak: none;
                    font-size: 40px;
                    transform: translateX(-100%);
                    -webkit-font-smoothing: antialiased;
                    &:hover{
                        cursor: pointer;
                        color: #fff;
                    }
                }
            }
            .list-album{
                width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            
            >.list-item{
                &:hover{
                    .list-time{
                        .hover{
                            transform: translateX(5%);
                            display: block;
                        }
                        span{
                            display: none;
                        }
                    }
                }
            }
        }
    @media (max-width: 1200px){
        .musicList{
            .list-header.list-item{
                .list-singer{
                    width: 150px;
                }
                .list-album{
                    width: 150px;
                }
            }
            .list-content{
                .list-album{
                    width: 150px;
                }
                .list-singer{
                    width: 150px;
                }
            }

        }
    }
</style>