<template>
    <!-- <keep-alive> -->
        <vue-scroll detectResize :ops="ops" style="height: clac(100% - 51px)">
            <div class="topList">
                <div class="topList-head">云音乐特色榜</div>
                <div class="topList-content">
                    <div
                        v-for="(item, index) in list" :key="index"
                        class="list-item1"
                        :title="item.name + item.updateFrequency"
                    >
                        <router-link 
                            :to="{path:`/music/details/${item.id}`}"
                            tag="div"
                            class="topList-item"
                        >
                            <div class="topList-img">
                                <img :src="`${item.coverImgUrl}?param300y300`" alt="">
                            </div>
                            <h3 class="name">{{ item.name }}</h3>
                        </router-link>
                    </div>
                </div>
                <div class="topList-head">热门歌单</div>
                <div class="topList-content">
                    <div
                        v-for="(item, index) in hotList" :key="index"
                        class="list-item1"
                        :title="item.name"
                    >
                        <router-link 
                            :to="{path: `/music/details/${item.id}`}"
                            tag="div"
                            class="topList-item"
                        >
                            <div class="topList-img">
                                <img :src="item.picUrl + '?param=300y300' " class="cover-img" alt="">
                            </div>
                            <h3 class="name">{{ item.name }}</h3>
                        </router-link>
                    </div>
                </div>
            </div>
        </vue-scroll>
    <!-- </keep-alive> -->
</template>
<script>
import api from '../../api/index.js';
export default {
    data() {
        return {
            ops: {//滚动条配置
                bar: {
                    keepShow: true,
                    background: 'rgb(168, 172, 171)'
                },
                rail: {
                    opacity: 0.3,
                    background: 'rgb(0, 0, 0)'
                }
            },
            list: [], // 云音乐特色榜
            hotList: [] //热门歌单
        }
    },
    created() {
        const _getTopListDetail = api.getDetail().then((res) => {
            if (res.data.code === 200) {
                let list;
                list = res.data.list.filter(item => {
                    if (item.ToplistType) {
                        return item;
                    }
                })
                return list;
            }
        }, (err) => {console.log('toplist' + err)})
        const _getPersonalized = api.getTopList().then((res) => {
            if (res.data.code === 200) {
                return res.data.result;
            }
        }, (err) => { console.log('toplist' + err) })
        Promise.all([_getTopListDetail, _getPersonalized]).then(([list, hotList]) => {
            this.list = list;
            this.hotList = hotList
            // console.log(list, hotList);
        })
    },
}
</script>
<style lang="less" scoped>
    .topList {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        &-head {
            width: 100%;
            height: 34px;
            line-height: 34px;
            padding: 20px 0;
            font-size: 18px;
            color: #fff;
        }
        &-content {
            overflow: hidden;

        }
        .list-item1 {
            float: left;
            width: calc(~'100% / 7');
            .topList-item {
                width: 130px;
                text-align: center;
                cursor: pointer;
                margin: 0 auto 20px;
                .topList-img{
                    height: 130px;
                    img{
                        width: 100%;
                    }
                }
                &:hover {
                    color: #fff;
                }
                .name {
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;

                }
                @media (max-width: 1100px) {
                    width: 80%;
                }
                }
                @media (max-width: 1500px) {
                    width: calc(~'100% / 6');
                }
                @media (max-width: 1400px), (max-width: 960px) {
                    width: calc(~'100% / 5');
                }
                @media (max-width: 1280px), (max-width: 768px) {
                    width: calc(~'100% / 4');
                }
                @media (max-width: 540px) {
                    width: calc(~'100% / 3');
                }
                .topList-img {
                    position: relative;
                    width: 100%;
                    .cover-img {
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
            }
        }
    }
</style>