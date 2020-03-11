<template>
    <div class="music-btn">
        <router-link tag="span" to="/music/playlist" >正在播放</router-link>
        <router-link tag="span" to="/music/toplist">推荐</router-link>
        <router-link tag="span" to="/music/search">搜索</router-link>
        <router-link tag="span" to="/music/userlist">我的歌单</router-link>
        <router-link tag="span" to="/music/historylist">我听过的</router-link>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less">
    .music-btn{
        width: 100%;
        height: 60px;
        // font-size: 0;
        span{
            display: inline-block;
            height: 40px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin-right: 8px;
            padding: 0 23px;
            border: 1px solid hsla(0,0%,100%,.6);
            color: hsla(0,0%,100%,.6);
            border-radius: 2px;
            font-size: 14px;
            line-height: 40px;
            overflow: hidden;
            cursor: pointer;
            &.active{
                color: #fff;
                border-color: #fff;
            }
        }
    }
</style>