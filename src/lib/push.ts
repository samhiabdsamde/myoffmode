import { logger } from './logger'

// Envoyer une push notification via Web Push API
export async function sendPushNotification(
  subscription: PushSubscriptionJSON,
  payload: { title: string; body: string; icon?: string; url?: string }
) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    logger.warn('[Push] VAPID keys non configurées')
    return
  }

  try {
    const webpush = require('web-push')
    webpush.setVapidDetails(
      'mailto:hello@myoffmode.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    )

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icon-192.png',
        badge: '/badge-72.png',
        data: { url: payload.url || '/' },
      })
    )
    logger.info('[Push] Notification envoyée')
  } catch (err: any) {
    logger.error('[Push] Error', { err: err.message })
  }
}
