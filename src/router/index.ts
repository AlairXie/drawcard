import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../pages/HomePage.vue';
import DrawPage from '../pages/DrawPage.vue';
import RunPage from '../pages/RunPage.vue';
import SubmitPage from '../pages/SubmitPage.vue';
import ResultPage from '../pages/ResultPage.vue';
import HistoryPage from '../pages/HistoryPage.vue';
import PoolPage from '../pages/PoolPage.vue';
const DashboardPage = () => import('../pages/DashboardPage.vue');

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/pool', component: PoolPage },
    { path: '/dashboard', component: DashboardPage },
    { path: '/draw', component: DrawPage },
    { path: '/run', component: RunPage },
    { path: '/submit', component: SubmitPage },
    { path: '/result', component: ResultPage },
    { path: '/history', component: HistoryPage }
  ]
});

router.afterEach(() => {
  document.title = '学习王者';
});
