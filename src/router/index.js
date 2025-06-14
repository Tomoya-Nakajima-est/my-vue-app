import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateView.vue'),
    },
    {
      path: '/delete',
      name: 'delete',
      component: () => import('../views/DeleteView.vue'),
    },
    {
      path: '/update',
      name: 'update',
      component: () => import('../views/UpdateView.vue'),
    },
    {
      path: '/suggest',
      name: 'suggest',
      component: () => import('../views/SuggestView.vue'),
    }
  ],
})

export default router
