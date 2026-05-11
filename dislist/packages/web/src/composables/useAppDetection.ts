import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useAppDetection() {
  const isMobile = ref(false)
  const isIOS = ref(false)
  const isStandalone = ref(false)
  const isInstalled = ref(false)
  const dismissed = ref(false)

  let deferredPrompt: any = null

  onMounted(() => {
    const ua = navigator.userAgent
    isMobile.value = /Android|iPhone|iPad|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document)
    isIOS.value = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document)

    // PWA standalone mode (added to home screen)
    isStandalone.value = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true

    // If we're in standalone or native app, mark as installed
    if (isStandalone.value) {
      isInstalled.value = true
    }

    // Check session storage for dismissal
    if (sessionStorage.getItem('chikki:dismiss-app-banner')) {
      dismissed.value = true
    }

    // Android: listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  })

  function onBeforeInstall(e: Event) {
    e.preventDefault()
    deferredPrompt = e
  }

  function dismissBanner() {
    dismissed.value = true
    sessionStorage.setItem('chikki:dismiss-app-banner', '1')
  }

  // Show banner on mobile when not already in app/standalone and not dismissed
  const showBanner = computed(() => isMobile.value && !isStandalone.value && !dismissed.value)

  return {
    isMobile,
    isIOS,
    isStandalone,
    isInstalled,
    showBanner,
    dismissBanner,
    deferredPrompt,
  }
}
