import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProgressView from '@/views/ProgressView.vue'
import ExamPaperView from '@/views/ExamPaperView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TrialExpiredView from '@/views/TrialExpiredView.vue'
import WritingView from '@/views/WritingView.vue'
import AdminView from '@/views/AdminView.vue'
import FeedbackView from '@/views/FeedbackView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'
import PracticeView from '@/views/PracticeView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
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
      path: '/practice',
      name: 'practice',
      component: PracticeView,
    },
    {
      path: '/writing',
      name: 'writing',
      component: WritingView,
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
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
      path: '/trial-expired',
      name: 'trial-expired',
      component: TrialExpiredView,
      meta: { public: true },
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: FeedbackView,
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: LeaderboardView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { adminOnly: true },
    },
    // 未匹配的路由（如已删除的 /exam）统一重定向到首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// 路由守卫：除首页、登录/注册外均需登录；admin 页面仅管理员可进；普通用户试用期已到则跳转提示页
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
