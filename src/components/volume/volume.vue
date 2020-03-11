<!--音量控制组件 -->
<template>
    <div class="volume" ref="volume">
        <icon
            class="pointer volume-icon"
            :type="getVolumeIconType()"
            :size="30"
            @click="handleToggleVolume">
        </icon>
        <div class="volume-progress-wrapper" ref="progress" @click="changeProgress">
            <div class="progress_bar" ref="progress_bar">
                <div class="progressLoad" ref="progressLoad"></div>
                <i ref="i" @click="barClick" @mousedown="barDown" @mouseup="handleUp"></i>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            isMute: false,
        }
    },
    props: {
        volume: {
            type: Number,
            required: true
        }
    },
    computed: {
        ...mapState(['audioEle']),
        volumePropgress(){
            return this.volume;
        },
        
    },
    methods: {
        getVolumeIconType(){
            // 'volume-off' : 'volume'
            return this.isMute ? 'volume-off' : 'volume';
        },
        handleToggleVolume(){
            if (!this.isMute) {
                this.setAudioVolume(0);
                this.moveSlide(0);
            }else{
                this.initVolume();
            }
            this.isMute = !this.isMute;
        },
        handleVolumeChange(){
            
        },
        /**
         * 点击i标签阻止事件冒泡
         */
        barClick (e){
            e.stopPropagation();
        },
        barDown(){
            if (!this.audioEle.src) {
                console.log('没有播放音乐')
                return;
            }
            document.addEventListener('mousemove', this.barMove);
            document.addEventListener('mouseup', this.barUp);
        },
        barMove(e){
            let offset = e.clientX - this.$refs.progress.offsetLeft;
            offset < 0 ? offset = 0 : offset;
            offset > this.$refs.progress.clientWidth ? offset = this.$refs.progress.clientWidth : offset;
            var offsetWidth = this.$refs.progressLoad.offsetWidth;
            if (offset == 0) {
                this.isMute = true;
            }else{
                this.isMute = false;
            }
            var total = offsetWidth / this.$refs.progress_bar.clientWidth * 1;
            this.setAudioVolume(total);
            this.moveSlide(offset);
        },
        barUp(){
            document.removeEventListener('mousemove', this.barMove);
            // var offsetWidth = this.$refs.progressLoad.offsetWidth;
            // var total = offsetWidth / this.$refs.progress_bar.clientWidth * 1;
            // this.setAudioVolume(total);
        },
        handleUp(){
            
        },
        /**
         * 点击progress跳转进度
         */
        changeProgress(e){
            if (!this.audioEle.src) {
                console.log('没有播放音乐')
                return;
            }
            let offset = e.clientX - this.$refs.progress.offsetLeft;
            if (offset == 0) {
                this.isMute = true;
            }
            this.moveSlide(offset);
            var offsetWidth = this.$refs.progressLoad.offsetWidth;
            var total = offsetWidth / this.$refs.progress_bar.clientWidth * 1;
            
            this.setAudioVolume(total);
        },
        /**
         * 修改audio音量
         */
        setAudioVolume(volume){
            this.audioEle.volume = volume;
        },
        /**
         * 移动滑块
         */
        moveSlide (offset){
            this.$refs.i.style.left = offset + "px";
            this.$refs.progressLoad.style.width = offset + "px";
        },
        initVolume(){
            this.moveSlide(this.$refs.progress_bar.offsetWidth * this.volume);
            this.setAudioVolume(this.volume);
        }
    },
    mounted(){
        this.initVolume();
        // console.log(this.$refs.progress_bar.offsetWidth * this.volume);
    }
}
</script>
<style lang="less">
    .volume {
        display: flex;
        align-items: center;
        width: 150px;
        &-icon {
            margin-right: 5px;
            color: #fff;
        }
        &-progress-wrapper {
            flex: 1;
            position: relative;
            .progress_bar {
                position: absolute;
                left: 0;
                height: 2px;
                width: 100%;
                background: hsla(0,0%,100%,.15);
                cursor: pointer;
                div.progressLoad {
                    position: absolute;
                    width: 0px;
                    height: 2px;
                    background-color: orange;
                    left: 0;
                    top: 0;
                    z-index: 20;
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
        @media (max-width: 768px) {
            top: 2px;
            width: 36px;
        }
    }
</style>