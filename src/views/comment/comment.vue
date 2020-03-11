<template>
    <div class="comment">
        <vue-scroll :ops="ops">
            <div class="comment-list">
                <div class="comment-title">精彩评论</div>
                <ul>
                    <li class="comment-item" v-for="(item, index) in hotComments" :key="index">
                        <a :href="`http://music.163.com/#/user/home?id=${item.user.userId}`">
                            <img :src="item.user.avatarUrl" alt="" class="comment-item-pic">
                            <h2 class="comment-item-title">{{item.user.nickname}}</h2>
                        </a>
                        <p class="comment-item-disc">{{ item.content }}</p>
                        <div class="comment-item-opt">
                            <span class="comment-item-date">{{ item.time | format }}</span>
                            <span class="comment-opt-liked">
                                <Icon type="good"></Icon>
                                {{ item.likedCount }}
                            </span>
                        </div>
                    </li>
                </ul>
                <div class="comment-title">最新评论 ({{total}})</div>
                <ul>
                    <li class="comment-item" v-for="(item) in commentList" :key="item.commentId">
                        <a
                            class="comment-item-pic"
                            target="_blank"
                            :href="`http://music.163.com/#/user/home?id=${item.user.userId}`"
                        >
                            <img :src="`${item.user.avatarUrl}?param=50y50`" class="cover-img" />
                        </a>
                            <h2 class="comment-item-title">
                            <a
                                target="_blank"
                                :href="`http://music.163.com/#/user/home?id=${item.user.userId}`"
                            >{{ item.user.nickname }}</a>
                            </h2>
                            <p class="comment-item-disc">{{ item.content }}</p>
                            <div
                            v-for="beReplied in item.beReplied"
                            :key="beReplied.user.userId"
                            class="comment-item-replied"
                            >
                            <a
                                target="_blank"
                                :href="`http://music.163.com/#/user/home?id=${beReplied.user.userId}`"
                            >{{ beReplied.user.nickname }}</a>
                            ：{{ beReplied.content }}
                            </div>
                            <div class="comment-item-opt">
                            <span class="comment-item-date">{{ item.time | format }}</span>
                            <span v-if="item.likedCount>0" class="comment-opt-liked">
                                <Icon type="good"></Icon>
                                {{ item.likedCount }}
                            </span>
                            </div>
                    </li>
                </ul>
            </div>
        </vue-scroll>
    </div>
</template>
<script>
import api from '../../api/index.js';
import Icon from '../../base/icon/icon.vue';
export default {
    components: {
        Icon
    },
    data() {
        return {
            ops: {//滚动条配置
                bar: {
                    keepShow: true,
                    background: 'rgb(168, 172, 171)',
                    minSize: 0.1
                },
                rail: {
                    opacity: 0.3,
                    background: 'rgb(0, 0, 0)'
                }
            },
            commentId: null,
            page: 0,//分页
            hotComments: [],//热门评论
            commentList: [],//最新评论
            total: null//总数
        }
    },
    filters: {
        format(time){
            let formatTime;
            var date = new Date(time);
            var diff = new Date().getTime() - time;
            var currentTime = new Date();
            // console.log(diff);
            let dateObj = {
                year: date.getFullYear(),//年
                month: date.getMonth() + 1,//月
                date: date.getDate(),//日
                hours: date.getHours(),//时
                minutes: date.getMinutes(),//分
            }
            if (currentTime.getDate() === dateObj.date && diff < 60000) { //评论时间距离现在小于一分钟
                formatTime = '刚刚'
            }else if (currentTime.getDate() === date.getDate() && diff > 60000 && diff < 3600000 ) {//评论时间在1分钟以上， 60分钟以下 
                formatTime = `${Math.floor(diff / 60000)}分钟前`;
            }else if (currentTime.getDate() === dateObj.date && diff < 86400000 && diff > 3600000){//评论时间在一天以内
                formatTime = `${dateObj.hours}: ${dateObj.minutes}`;
            } else if (currentTime.getDate() !== dateObj.date && diff < 86400000) {
                formatTime = `昨天${addZero(dateObj.hours)}:${addZero(dateObj.minutes)}`
            } else if (currentTime.getFullYear() === dateObj.year) {//评论时间的年份和当前的年份相等
                formatTime = `${dateObj.month + 1}月${dateObj.date}日`
            } else {
                formatTime = `${dateObj.year}年${dateObj.month + 1}月${dateObj.date}日`
            }
            return formatTime;
        }
    },
    mounted() {
        api.getMusicComment(this.$route.params.id, this.page).then(res => {
            // console.log(res);
            if (res.status == 200) {
                this.hotComments = res.data.hotComments;
                this.commentList = res.data.comments;
                this.total = res.data.total;
            }
        }, err => {
            console.log(err);
        })
    },
    methods: {
        
    }
}
</script>
<style lang="less">
    .comment{
        .comment-list{
            padding: 0 10px;
            .comment-title{
                height: 34px;
                line-height: 34px;
                padding: 10px 0;
                color: #fff;
                border-bottom: 1px solid hsla(0,0%,100%,.8);
                
            }
            ul {
                    .comment-item{
                        position: relative;
                        padding: 15px 0 15px 55px;
                        border-bottom: 1px solid hsla(0,0%,100%,.1);
                        .comment-item-pic{
                            position: absolute;
                            left: 0;
                            top: 20px;
                            width: 38px;
                            height: 38px;
                            border-radius: 50%;
                            overflow: hidden;
                        }
                        a {
                            color: #fff;
                        }
                        p {
                            overflow: hidden;
                            word-break: break-all;
                            word-wrap: break-word;
                            line-height: 25px;
                            text-align: justify;
                            color: hsla(0,0%,100%,.6);
                        }

                        .comment-item-opt{
                            margin-top: 10px;
                            line-height: 25px;
                            text-align: right;
                            overflow: hidden;
                            .comment-item-date{
                                float: left;
                                line-height: 28px;
                            }
                            .comment-opt-liked{
                                display: inline-block;
                                height: 20px;
                                line-height: 20px;
                            }
                        }
                        .comment-item-replied{
                            padding: 8px 19px;
                            margin-top: 10px;
                            line-height: 20px;
                            border: 1px solid hsla(0,0%,100%,.3);
                        }
                    }
                }
        }
    }
</style>