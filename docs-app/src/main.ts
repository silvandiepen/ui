import { createApp } from 'vue'

import logoUrl from '@ui-lib/assets/logo.svg'
import App from './App.vue'
import Example from './components/Example.vue'
import { i18n } from './i18n'
import { router } from './router'

import './styles/main.scss'

const favicon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]') ?? document.createElement('link')
favicon.rel = 'icon'
favicon.type = 'image/svg+xml'
favicon.href = logoUrl

if (!favicon.parentNode) {
  document.head.appendChild(favicon)
}

createApp(App)
  .component('Example', Example)
  .use(i18n)
  .use(router)
  .mount('#app')
