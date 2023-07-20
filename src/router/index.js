import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'sondage',
      component: () => import('../views/Survey.vue') //Route pour la page des sondages
    },
    {
      path: '/q',
      name: 'question',
      component: () => import('../components/Questions.vue')
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: () => import('../views/Admin/Login.vue') //Route pour le login 
    },
    {
      path: '/administration',
      name: 'administration',
      component: () => import('../views/Admin/Dashboard_home.vue') //Route pour le login 
    },

  ]
})

export default router
