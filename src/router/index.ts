import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/appointments',
      name: 'Appointments',
      component: () => import('../views/AppointmentsView.vue'),
    },
    {
      path: '/care-plan',
      name: 'CarePlan',
      component: () => import('../views/CarePlanView.vue'),
    },
    {
      path: '/messages',
      name: 'Messages',
      component: () => import('../views/MessagesView.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
    },
  ],
})

export default router
