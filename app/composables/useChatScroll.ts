import { ref, nextTick, type Ref } from 'vue'

export interface UseChatScrollOptions {
  /**
   * Callback invoked when user scrolls to top and more messages are available.
   * Should fetch older messages and prepend them to the message list.
   */
  onLoadMore?: () => Promise<void>
  /**
   * Scroll threshold from top (in px) to trigger onLoadMore.
   * Defaults to 40px.
   */
  threshold?: number
}

/**
 * useChatScroll — Composable encapsulating upward infinite scroll logic.
 *
 * Keeps all logical parts related to infinite scrolling upwards:
 * - Detecting when scroll reaches top threshold
 * - Capturing scrollHeight before prepending older messages
 * - Restoring scroll position seamlessly after messages are prepended
 * - Scrolling to bottom on new messages
 * - Checking if user is near bottom
 */
export function useChatScroll(
  containerRef: Ref<HTMLElement | null>,
  options: UseChatScrollOptions = {},
) {
  const isLoadingMore = ref(false)
  const threshold = options.threshold ?? 40

  /**
   * Capture the current scrollHeight before DOM updates.
   */
  const captureScrollPosition = (): number => {
    return containerRef.value?.scrollHeight ?? 0
  }

  /**
   * Restore scroll position so user sees zero visual jump after older messages are prepended.
   */
  const restoreScrollPosition = async (previousScrollHeight: number): Promise<void> => {
    await nextTick()
    const el = containerRef.value
    if (!el) return
    const newScrollHeight = el.scrollHeight
    el.scrollTop = newScrollHeight - previousScrollHeight
  }

  /**
   * Scrolls the container to the very bottom.
   */
  const scrollToBottom = async (smooth = false): Promise<void> => {
    await nextTick()
    const el = containerRef.value
    if (!el) return
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    })
  }

  /**
   * Checks whether the user is near the top of the scroll container.
   */
  const isNearTop = (): boolean => {
    const el = containerRef.value
    if (!el) return false
    return el.scrollTop <= threshold
  }

  /**
   * Checks whether the user is near the bottom of the scroll container.
   */
  const isNearBottom = (bottomThreshold = 100): boolean => {
    const el = containerRef.value
    if (!el) return false
    return el.scrollHeight - el.scrollTop - el.clientHeight <= bottomThreshold
  }

  /**
   * Scroll event handler. Triggers onLoadMore if near top, preserving scroll position.
   */
  const handleScroll = async (): Promise<void> => {
    if (!options.onLoadMore || isLoadingMore.value) return
    if (!isNearTop()) return

    const prevHeight = captureScrollPosition()
    isLoadingMore.value = true
    try {
      await options.onLoadMore()
      await restoreScrollPosition(prevHeight)
    } finally {
      isLoadingMore.value = false
    }
  }

  return {
    isLoadingMore,
    captureScrollPosition,
    restoreScrollPosition,
    scrollToBottom,
    isNearTop,
    isNearBottom,
    handleScroll,
  }
}
