export const useAudioNotification = () => {
  let audio: HTMLAudioElement | null = null

  const playNotification = () => {
    if (!import.meta.client) return

    try {
      audio = new Audio('/sounds/notification.mp3')
      audio.play().catch(() => {
        console.warn('1')
      })
    } catch {
      console.warn('2')
    }
  }

  return { playNotification }
}
