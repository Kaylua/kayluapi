import { createRouter, createWebHistory } from 'vue-router';
import Auth from '../views/Auth.vue';
import Guilds from '../views/Guilds.vue';
import Windaube_XPTDR from '../views/Windaube_XPTDR.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: Auth
    },
    {
      path: '/guilds',
      name: 'guilds',
      component: Guilds
    },
    {
      path: '/windaube_XP-TDR',
      name: 'OS',
      component: Windaube_XPTDR
    }
  ]
})

export default router;
