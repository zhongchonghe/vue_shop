import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'
import Roles from '@/components/power/Roles.vue'
import Rights from '@/components/power/Rights.vue'
import List from '@/components/goods/List.vue'
import Add from '@/components/goods/Add.vue'
import Cate from '@/components/goods/Cate.vue'
import index from '@/components/goods/index.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/rights', component: Rights },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/categories', component: Cate },
        { path: '/index', component: index },

      ]

    },
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()

  // 获取token
  let tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
