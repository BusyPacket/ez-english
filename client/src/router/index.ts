import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProgressView from '@/views/ProgressView.vue'
import ExamView from '@/views/ExamView.vue'
import ExamPaperView from '@/views/ExamPaperView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
  ],
})

export default router
