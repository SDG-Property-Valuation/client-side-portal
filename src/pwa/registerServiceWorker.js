import { registerSW } from 'virtual:pwa-register'

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return
  }

  registerSW({
    immediate: true,
    onRegisterError(error) {
      console.error('PWA service worker registration failed:', error)
    },
  })
}
