import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../pages/HomePage.vue';
import DrawPage from '../pages/DrawPage.vue';
import RunPage from '../pages/RunPage.vue';
import SubmitPage from '../pages/SubmitPage.vue';
import ResultPage from '../pages/ResultPage.vue';
import HistoryPage from '../pages/HistoryPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/draw', component: DrawPage },
    { path: '/run', component: RunPage },
    { path: '/submit', component: SubmitPage },
    { path: '/result', component: ResultPage },
    { path: '/history', component: HistoryPage }
  ]
});

router.afterEach(() => {
  document.title = '微行动';
});
