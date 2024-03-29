// Composables
import { createRouter, createWebHistory } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/Admin.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const store = useAppStore()
  const { user } = storeToRefs(store)

  if (user.value.type === 'ADMIN' && to.name !== 'Admin') {
    return { name: 'Admin' }    
  }
  
  if (user.value.type !== 'ADMIN' && to.name === 'Admin') {
    return { name: 'Dashboard' }    
  }

  if (!user.value.username && (to.name !== 'Login' && to.name !== 'Register')) {
    return { name: 'Login' }
  }

  if (user.value.username && to.name === 'Login') {
    return { name: 'Dashboard' }
  }
});

export default router
