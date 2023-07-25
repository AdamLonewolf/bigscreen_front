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
      path: '/reponses/:token',
      name: 'reponses',
      component: () => import('../views/Responses.vue'), //Route pour la page des réponses
      props: true
    },
    {
      path: '/connexion_administration',
      name: 'connexion',
      component: () => import('../views/Admin/Login.vue') //Route pour le login 
    },
    {
      path: '/administration',
      name: 'administration.home',
      component: () => import('../views/Admin/Dashboard_home.vue') //Route pour le dashboard (Accueil)
    },
    {
      path: '/administration_questions',
      name: 'administration.questions',
      component: () => import('../views/Admin/Dashboard_questions.vue') //Route pour le dashboard (Page Questions)
    },
    {
      path: '/administration_reponses',
      name: 'administration.reponses',
      component: () => import('../views/Admin/Dashboard_responses.vue')  //Route pour le dashboard (Page Réponses)
    },
    

  ]
})


//Je fais un guard pour protéger mes routes
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('admin_token'); //On récupère le token dans le session storage
  const requiresAuth = ['administration.home', 'administration.questions', 'administration.reponses',];
  
  //Si on souhaite naviger vers une page contenue dans le tableau requiresAuth et que qu'on a pas le token, on est redirigé vers le login

  if (requiresAuth.includes(to.name) && !token) {
    // Je redirige vers la page de connexion si l'administrateur n'est pas connecté
    next({ name: 'connexion' });
  } else {
    // Sinon j'autorise l'accès à la route demandée
    next();
  }
});

export default router
