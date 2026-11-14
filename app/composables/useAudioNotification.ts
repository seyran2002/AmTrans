export const useAudioNotification = () => {
  const playNotification = async () => {
    try {
      const audio = new Audio('/sounds/notification.mp3')
      audio.currentTime = 0 // Reset play position
      await audio.play()
    } catch (error) {
      // Բրաուզերը կարող է արգելափակել auto-play-ը, եթե օգտատերը դեռ էջի հետ չի փոխազդել (click)
      console.warn('Audio playback was blocked or failed:', error)
    }
  }

  return { playNotification }
}