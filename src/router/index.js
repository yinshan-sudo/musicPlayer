import Vue from 'vue';
import VueRouter from 'vue-router';
import music from '../views/music.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/music'
  },
  {
    path: '/music',
    name: 'music',
    component: music,
    redirect: 'music/playlist',
    children: [
      {
        path: 'playlist',
        name: 'playlist',
        component: () => import('../views/playList/playList.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'toplist',
        component: () => import('../views/topList/topList.vue'),
        meta: {
          title: '排行榜',
          keepAlive: true 
        }
      },
      {
        path: 'search',
        component: () => import('../views/search/search.vue'),
        meta: {
          title: '搜索',
          keepAlive: true
        }
      },
      {
        path: 'userlist',
        component: () => import('../views/userList/userList.vue'),
        meta: {
          title: '我的歌单',
          keepAlive: true
        }
      },
      {
        path: 'historylist',
        component: () => import('../views/historyList/historyList.vue'),
        meta: {
          title: '我听过的'
        }        
      },
      {
        path: 'details/:id',
        component: () => import('../views/details/details.vue')
      },
      {
        path: 'comment/:id',
        component: () => import('../views/comment/comment.vue'),
        meta: {
          title: '评论'
        }
      }
    ]
  }
];

const router = new VueRouter({
  // mode: 'history',
  linkExactActiveClass: 'active',
  base: process.env.BASE_URL,
  routes,
});

export default router;
