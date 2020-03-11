<template>
    <div class="historyList">
        <MusicList
            :list="historyList"
            :list-type="1"
            @select="selectItem"
            @del="delectItem">
            </MusicList>
    </div>
</template>
<script>
import MusicList from '../../components/music-list/Music-list.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    components: {
        MusicList
    },
    computed: {
        ...mapGetters(['historyList', 'playing', 'currentMusic'])
    },
    methods: {
        // 清空列表事件
        clearList(){

        },
        // 播放事件
        selectItem(item, index){
            this.selectPlay({
                list: this.historyList,
                index
            })
        },
        // 删除事件
        delectItem(index){
            let list = [...this.historyList]
            list.splice(index, 1);
            this.removeHistory(list);
        },
        ...mapMutations({
            setPlaying: 'SET_PLAYING'
        }),
        ...mapActions(['selectPlay', 'clearHistory', 'removeHistory'])
    },
}
</script>
<style lang="less">
    
</style>