import { createRouter, createWebHistory } from 'vue-router'

import DocsCategoryPage from './pages/DocsCategoryPage.vue'
import DocsComposablePage from './pages/DocsComposablePage.vue'
import DocsComposablesPage from './pages/DocsComposablesPage.vue'
import DocsComponentPage from './pages/DocsComponentPage.vue'
import DocsFormBuilderPage from './pages/DocsFormBuilderPage.vue'
import DocsFoundationTypesPage from './pages/DocsFoundationTypesPage.vue'
import DocsGettingStartedPage from './pages/DocsGettingStartedPage.vue'
import DocsGuidePage from './pages/DocsGuidePage.vue'
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
      path: '/guides/form-builder',
      name: 'docs-guide-form-builder',
      component: DocsFormBuilderPage,
    },
    {
      path: '/guides/foundation-types',
      name: 'docs-guide-foundation-types',
      component: DocsFoundationTypesPage,
    },
    {
      path: '/guides/:slug',
      name: 'docs-guide',
      component: DocsGuidePage,
      props: true,
    },
    {
      path: '/guides/composables',
      name: 'docs-guide-composables',
      component: DocsComposablesPage,
    },
    {
      path: '/composables/:slug',
      name: 'docs-composable',
      component: DocsComposablePage,
      props: true,
    },
    {
      path: '/components/:slug',
      name: 'docs-component',
      component: DocsComponentPage,
      props: true,
    },
  ],
})
