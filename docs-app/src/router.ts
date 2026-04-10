import { createRouter, createWebHistory } from 'vue-router'

import DocsComponentPage from './pages/DocsComponentPage.vue'
import DocsHomePage from './pages/DocsHomePage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'docs-home',
      component: DocsHomePage,
    },
    {
      path: '/components/:slug',
      name: 'docs-component',
      component: DocsComponentPage,
      props: true,
    },
  ],
})
