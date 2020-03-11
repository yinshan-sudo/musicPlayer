<template>
    <div class="progress" ref="progress" @click="changeProgress"> 
        <div class="progress_bar" ref="progress_bar">
            <div class="progressLoad" ref="progressLoad"></div>
            <div class="buffered" ref="buffered"></div>
            <i ref="i" @click="barClick" @mousedown="barDown" @mouseup="handleUp"></i>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
    // name: 'mprogress',
    props: {
        // 进度值1
        percent: {
            type: [Number],
            default: 0
        },
        // 进度值2(歌曲缓冲进度用)
        percentProgress: {
            type: [Number],
            default: 0
        }
    },
    data() {
        return {
            move: {
                status: false,//是否可拖动
                startX: 0,//记录最开始点击的X坐标
                left: 0,//记录当前已经移动的距离
            }
        }
    },
    computed: {
        ...mapState(['audioEle', 'playing'])
    },
    methods: {
        /**
         * 点击i标签阻止事件冒泡
         */
        barClick (e){
            e.stopPropagation();
        },
        /**
         * i标签鼠标按下事件
         */
        barDown (){
            if (!this.audioEle.src) {
                console.log('没有播放音乐')
                return;
            }
            // console.log(this.playing);
            this.audioEle.pause();
            document.addEventListener('mousemove', this.barMove);
            document.addEventListener('mouseup', this.barUp);
        },
        /**
         * document鼠标抬起事件
         */
        barUp (){
            document.removeEventListener('mousemove', this.barMove);
            var offsetWidth = this.$refs.progressLoad.offsetWidth;
            var total = offsetWidth / this.$refs.progress_bar.clientWidth * this.audioEle.duration;
            // console.log(Math.floor(total) === Math.floor(this.audioEle.duration));
            // console.log(total === this.audioEle.duration);
            if (Math.floor(total) === Math.floor(this.audioEle.duration) ){//当拖拽后的播放时长和音乐的时长相等时自动播放下一首
                this.$emit('next');
                return;
            }
            this.setAudioPlayTime(total);
            this.audioEle.play(); 
        },
        /**
         * 鼠标移动事件
         */
        barMove(e){
            let offset = e.clientX - this.$refs.progress.offsetLeft - 180 - 25;
            offset < 0 ? offset = 0 : offset;
            offset > this.$refs.progress.clientWidth ? offset = this.$refs.progress.clientWidth : offset;
            this.moveSlide(offset);
        },
        /**
         * 移动滑块
         */
        moveSlide (offset){
            this.$refs.i.style.left = offset + "px";
            this.$refs.progressLoad.style.width = offset + "px";
        },
        /**
         * 点击progress跳转进度
         */
        changeProgress(e){
            if (!this.audioEle.src) {
                console.log('没有播放音乐')
                return;
            }
            let offset = e.clientX - this.$refs.progress.offsetLeft - 180 - 25;
            this.moveSlide(offset);
            var offsetWidth = this.$refs.progressLoad.offsetWidth;
            var total = offsetWidth / this.$refs.progress_bar.clientWidth * this.audioEle.duration;
            this.setAudioPlayTime(total);
        },
        /**
         * 修改audio的播放时间
         * 
         */
        setAudioPlayTime(time){
            this.audioEle.currentTime = time.toFixed(3);
        },
        /**
         * i标签鼠标抬起
         */
        handleUp(){
            console.log('i is mouseUp' );
        }
    },
    mounted (){
        let self = this;
        this.audioEle.addEventListener('progress', function(){
            function getBuffered () {
                let loaded;
                if (self.audioEle.buffered.length) {
                    loaded = 100 * self.audioEle.buffered.end(0) / self.audioEle.duration;
                    // console.log(loaded);
                    self.$refs.buffered.style.width = loaded + "%";
                }
                if (loaded == 100) {
                    return;
                }
                setTimeout(getBuffered, 100) 
            }
            getBuffered();
        })
        this.audioEle.addEventListener('timeupdate', function(){
            // console.log(self.$refs.progress.clientWidth);
            var total = self.audioEle.duration;
            var nowTime = self.audioEle.currentTime;
            var width = nowTime / total * self.$refs.progress.clientWidth;
            self.moveSlide(width);
        })
    }
}
</script>
<style lang="less">
    .progress {
        position: relative;
        padding: 5px;
        user-select: none;
        cursor: pointer;
        // width: 100%;
        overflow: hidden;
        .progress_bar {
            position: absolute;
            left: 0;
            height: 2px;
            width: 100%;
            background: hsla(0,0%,100%,.15);
            div.progressLoad {
                position: absolute;
                width: 0px;
                height: 2px;
                background-color: orange;
                left: 0;
                top: 0;
                z-index: 20;
            }
            .buffered{
                position: absolute;
                width: 0px;
                height: 2px;
                background-color: #0f0;
                left: 0;
                top: 0;
            }
            i {
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 3px;
                background-color: #fff;
                left: 0px;
                top: -2px;
            }
            
        }
        
    }
</style>