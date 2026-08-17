import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProgressView from '@/views/ProgressView.vue'
import ExamView from '@/views/ExamView.vue'
import ExamPaperView from '@/views/ExamPaperView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import AdminView from '@/views/AdminView.vue'
import FeedbackView from '@/views/FeedbackView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { public: true },
    },
    {
      path: '/progress',
      name: 'progress',
      component: ProgressView,
    },
    {
      path: '/exam',
      name: 'exam',
      component: ExamView,
    },
    {
      path: '/exam-paper',
      name: 'exam-paper',
      component: ExamPaperView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { public: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: FeedbackView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { adminOnly: true },
    },
  ],
})

// 路由守卫：除首页、登录/注册外均需登录；admin 页面仅管理员可进
router.beforeEach((to) => {
  if (to.meta.public) return
  const userStore = useUserStore()
  if (!userStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.adminOnly && userStore.user?.role !== 'admin') {
    return { name: 'home' }
  }
})

export default router
