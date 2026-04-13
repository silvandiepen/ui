import { createRouter, createWebHistory } from 'vue-router'

import DocsCategoryPage from './pages/DocsCategoryPage.vue'
import DocsComposablesPage from './pages/DocsComposablesPage.vue'
import DocsComponentPage from './pages/DocsComponentPage.vue'
import DocsGettingStartedPage from './pages/DocsGettingStartedPage.vue'
import DocsHomePage from './pages/DocsHomePage.vue'
import DocsThemeBuilderPage from './pages/DocsThemeBuilderPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'docs-home',
      component: DocsHomePage,
    },
    {
      path: '/categories/:categoryId',
      name: 'docs-category',
      component: DocsCategoryPage,
      props: true,
    },
    {
      path: '/guides/getting-started',
      name: 'docs-guide-getting-started',
      component: DocsGettingStartedPage,
    },
    {
      path: '/guides/theme-builder',
      name: 'docs-guide-theme-builder',
      component: DocsThemeBuilderPage,
    },
    {
      path: '/guides/composables',
      name: 'docs-guide-composables',
      component: DocsComposablesPage,
    },
    {
      path: '/components/:slug',
      name: 'docs-component',
      component: DocsComponentPage,
      props: true,
    },
  ],
})
