<template>
    <div class="music-bar">
        <div class="music-bar-btns">
            <i class="pointer iconfont icon-prev"></i>
            <div class="control-play pointer">
                <i class="iconfont icon-pause" v-if="isPlay"></i>
                <i class="iconfont icon-play" v-else></i>
            </div>
            <i class="pointer iconfont icon-next"></i>
        </div>
        <div class="music-music" ref="music" :style="{width: outerWidth + 'px'}">
            <div class="music-bar-info">
                {{musicInfo.name }}
                <span>-{{musicInfo.ar[0].name}}</span>
            </div>
            <div class="music-bar-time">
                {{time(musicInfo.duration)}}
            </div>
            <div class="music-progress">
                <div class="progress-bar"></div>
                <div class="progress-outer"></div>
                <div class="progress-inner" :style="{width: progress + 'px'}">
                    <div class="progress-dot"></div>
                </div>
            </div>
        </div>
        <i class="iconfont mode" @click="handlePlayType" :class="playType"></i>
        <router-link class="iconfont icon-comment mode" tag="i" :to="'/music/comment/' + musicInfo.id"></router-link>
        <div class="music-bar-volume">
            <div class="volume">
                <i class="iconfont icon-volume"></i>
                <div class="volume-progress-wrapper">
                    <div class="mmProgress">
                        <div class="mmProgress-bar"></div>
                        <div class="mmProgress-outer"></div>
                        <div class="mmProgress-inner" :style="{width: volume}">
                            <div class="mmProgress-dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isPlay: false,//是否为播放状态
            outerWidth: 0,//进度条总长度
            progress: 0,//播放进度
            typeIndex: 0,//当前播放类型的第几项
            
        }
    },
    computed: {
        volume(){//音量
            return this.$store.state.volume * 100 + '%';
        },
        musicInfo(){
            return this.$store.state.musicObj ? this.$store.state.musicObj : {name: '欢迎使用音乐播放器', ar: { '0':{name: 'Player'}}, duration: null};
        },
        playType(){
            return this.$store.state.currentType;
        }
    },
    methods: {
        handlePlayType(){//改变播放类型
            this.typeIndex = ++this.typeIndex % 4;
            var type = this.$store.commit('filterPlayType', this.typeIndex);
            
        },
        time(duration){
            // console.log(this.musicInfo);
            if (!duration) {
                return '';
            }
            var Minute = parseInt(duration / 1000 / 60);
            var Second = parseInt(duration / 1000 - Minute * 60);
            Minute = Minute < 10 ? '0' + Minute : Minute + '';
            Second = Second < 10 ? '0' + Second : Second + '';
            var time =  this.musicInfo.currentTime[0] + '/'+ Minute + ":" + Second;
            // console.log(Minute < 10 ? '0' + Minute : Minute + '', Second < 10 ? '0' + Second : Second + '' );
            return time;
        },
    },
    mounted() {
        var music = this.$refs.music;
        this.outerWidth = music.offsetWidth;
        
        window.addEventListener('resize', ()=> {
            this.outerWidth = music.offsetWidth;
        })
    },
    beforeUpdate() {
    },
    updated() {
        
    },
}
</script>
<style lang="less">
    .music-bar{
        .music-bar-btns{
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 180px;
            div{
                display: flex;
                flex-direction: row;
                justify-content: center;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                color: #fff;
                background-color: hsla(0,0%,100%,.3);
                i{
                    font-size: 24px;
                }
            }
            i{
                cursor: pointer;
                display: inline-block;
                font-style: normal;
                font-weight: 400;
                font-variant: normal;
                line-height: 40px;
                vertical-align: baseline;
                text-transform: none;
                speak: none;
                font-size: 36px;
            }
        }
        .music-music{
            position: relative;
            width: 100%;
            flex: 1;
            box-sizing: border-box;
            padding-left: 40px;
            font-size: 12px;
            color: #fff;
        }
        .music-bar-info{
            height: 15px;
            padding-right: 80px;
            line-height: 15px;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .music-bar-time{
            position: absolute;
            top: 0;
            right: 5px;
        }
        .music-progress{
            position: relative;
            padding: 5px;
            .progress-bar{
                height: 2px;
                width: 100%;
                background: hsla(0,0%,100%,.15);

            }
            .progress-outer, .progress-inner{
                position: absolute;
                top: 50%;
                left: 5px;
                display: inline-block;
                width: 100%;
                height: 2px;
                margin-top: -1px;
            }
            .progress-inner{
                background: #fff;
                .progress-dot{
                    position: absolute;
                    top: 50%;
                    right: -5px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: #fff;
                    transform: translateY(-50%);
                }
            }
        }
        .mode{
            font-size: 30px;
            margin-left: 20px;
        }
        .music-bar-volume{
            margin-left: 20px;
            // margin-right: 10px;
            .volume{
                display: flex;
                align-items: center;
                width: 150px;
                >i{
                    font-size: 30px;
                }
                .volume-progress-wrapper{
                    flex: 1;
                    .mmProgress{
                        position: relative;
                        padding: 5px;
                        user-select: none;
                        cursor: pointer;
                        overflow: hidden;
                        .mmProgress-bar{
                            height: 2px;
                            width: 100%;
                            background: hsla(0,0%,100%,.15);
                        }
                        .mmProgress-outer, .mmProgress-inner{
                            position: absolute;
                            top: 50%;
                            left: 5px;
                            display: inline-block;
                            width: 0;
                            height: 2px;
                            margin-top: -1px;
                        }
                        .mmProgress-inner{
                            background: #fff;
                            .mmProgress-dot{
                                position: absolute;
                                top: 50%;
                                right: -5px;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background-color: #fff;
                                transform: translateY(-50%);
                            }
                        }
                    }
                }
            }
        }
    }
</style>