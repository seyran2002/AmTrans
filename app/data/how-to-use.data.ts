export interface TutorialStep {
  id: string
  number: string
  title: string
  description: string
  details?: string[]
  badge?: string
}

export interface TutorialTip {
  title: string
  content: string
  type?: 'tip' | 'important' | 'warning'
}

export interface TutorialChapter {
  id: string
  number: string
  title: string
  shortTitle: string
  subtitle: string
  description: string
  readTime: string
  steps?: TutorialStep[]
  tips: TutorialTip[]
}

export function getTutorialChapters(t: (key: string) => string): TutorialChapter[] {
  return [
    {
      id: 'chapter-01',
      number: t('howToUse.ch1.number') || '01',
      title: t('howToUse.ch1.title'),
      shortTitle: t('howToUse.ch1.shortTitle'),
      subtitle: t('howToUse.ch1.subtitle'),
      description: t('howToUse.ch1.description'),
      readTime: t('howToUse.ch1.readTime'),
      tips: [
        {
          type: 'important',
          title: t('howToUse.ch1.tip1Title'),
          content: t('howToUse.ch1.tip1Content')
        },
        {
          type: 'tip',
          title: t('howToUse.ch1.tip2Title'),
          content: t('howToUse.ch1.tip2Content')
        }
      ]
    },
    {
      id: 'chapter-02',
      number: t('howToUse.ch2.number') || '02',
      title: t('howToUse.ch2.title'),
      shortTitle: t('howToUse.ch2.shortTitle'),
      subtitle: t('howToUse.ch2.subtitle'),
      description: t('howToUse.ch2.description'),
      readTime: t('howToUse.ch2.readTime'),
      tips: [
        {
          type: 'important',
          title: t('howToUse.ch2.tip1Title'),
          content: t('howToUse.ch2.tip1Content')
        },
        {
          type: 'tip',
          title: t('howToUse.ch2.tip2Title'),
          content: t('howToUse.ch2.tip2Content')
        }
      ]
    },
    {
      id: 'chapter-03',
      number: t('howToUse.ch3.number') || '03',
      title: t('howToUse.ch3.title'),
      shortTitle: t('howToUse.ch3.shortTitle'),
      subtitle: t('howToUse.ch3.subtitle'),
      description: t('howToUse.ch3.description'),
      readTime: t('howToUse.ch3.readTime'),
      tips: [
        {
          type: 'important',
          title: t('howToUse.ch3.tip1Title'),
          content: t('howToUse.ch3.tip1Content')
        },
        {
          type: 'tip',
          title: t('howToUse.ch3.tip2Title'),
          content: t('howToUse.ch3.tip2Content')
        }
      ]
    },
    {
      id: 'chapter-04',
      number: t('howToUse.ch4.number') || '04',
      title: t('howToUse.ch4.title'),
      shortTitle: t('howToUse.ch4.shortTitle'),
      subtitle: t('howToUse.ch4.subtitle'),
      description: t('howToUse.ch4.description'),
      readTime: t('howToUse.ch4.readTime'),
      tips: [
        {
          type: 'important',
          title: t('howToUse.ch4.tip1Title'),
          content: t('howToUse.ch4.tip1Content')
        },
        {
          type: 'tip',
          title: t('howToUse.ch4.tip2Title'),
          content: t('howToUse.ch4.tip2Content')
        }
      ]
    },
    {
      id: 'chapter-05',
      number: t('howToUse.ch5.number') || '05',
      title: t('howToUse.ch5.title'),
      shortTitle: t('howToUse.ch5.shortTitle'),
      subtitle: t('howToUse.ch5.subtitle'),
      description: t('howToUse.ch5.description'),
      readTime: t('howToUse.ch5.readTime'),
      tips: [
        {
          type: 'important',
          title: t('howToUse.ch5.tip1Title'),
          content: t('howToUse.ch5.tip1Content')
        },
        {
          type: 'tip',
          title: t('howToUse.ch5.tip2Title'),
          content: t('howToUse.ch5.tip2Content')
        }
      ]
    },
    {
      id: 'chapter-06',
      number: t('howToUse.ch6.number') || '06',
      title: t('howToUse.ch6.title'),
      shortTitle: t('howToUse.ch6.shortTitle'),
      subtitle: t('howToUse.ch6.subtitle'),
      description: t('howToUse.ch6.description'),
      readTime: t('howToUse.ch6.readTime'),
      tips: [
        {
          type: 'important',
          title: t('howToUse.ch6.tip1Title'),
          content: t('howToUse.ch6.tip1Content')
        },
        {
          type: 'tip',
          title: t('howToUse.ch6.tip2Title'),
          content: t('howToUse.ch6.tip2Content')
        }
      ]
    },
    {
      id: 'chapter-07',
      number: t('howToUse.ch7.number') || '07',
      title: t('howToUse.ch7.title'),
      shortTitle: t('howToUse.ch7.shortTitle'),
      subtitle: t('howToUse.ch7.subtitle'),
      description: t('howToUse.ch7.description'),
      readTime: t('howToUse.ch7.readTime'),
      tips: [
        {
          type: 'important',
          title: t('howToUse.ch7.tip1Title'),
          content: t('howToUse.ch7.tip1Content')
        },
        {
          type: 'tip',
          title: t('howToUse.ch7.tip2Title'),
          content: t('howToUse.ch7.tip2Content')
        }
      ]
    }
  ]
}

export function getStatusDefinitions(t: (key: string) => string): Record<string, { label: string; description: string; variant: 'warning' | 'info' | 'secondary' | 'primary' | 'success' | 'danger'; dotClass: string; stage: 'normal' | 'estimate' | 'terminal' }> {
  return {
    UNDER_REVIEW: {
      label: t('howToUse.statuses.UNDER_REVIEW.label'),
      description: t('howToUse.statuses.UNDER_REVIEW.description'),
      variant: 'warning',
      dotClass: 'bg-amber-500 animate-pulse',
      stage: 'normal'
    },
    PENDING_ESTIMATE: {
      label: t('howToUse.statuses.PENDING_ESTIMATE.label'),
      description: t('howToUse.statuses.PENDING_ESTIMATE.description'),
      variant: 'warning',
      dotClass: 'bg-amber-500 animate-pulse',
      stage: 'estimate'
    },
    REGISTERED: {
      label: t('howToUse.statuses.REGISTERED.label'),
      description: t('howToUse.statuses.REGISTERED.description'),
      variant: 'info',
      dotClass: 'bg-blue-500',
      stage: 'normal'
    },
    FOREIGN_WAREHOUSE: {
      label: t('howToUse.statuses.FOREIGN_WAREHOUSE.label'),
      description: t('howToUse.statuses.FOREIGN_WAREHOUSE.description'),
      variant: 'secondary',
      dotClass: 'bg-secondary',
      stage: 'normal'
    },
    IN_TRANSIT: {
      label: t('howToUse.statuses.IN_TRANSIT.label'),
      description: t('howToUse.statuses.IN_TRANSIT.description'),
      variant: 'warning',
      dotClass: 'bg-amber-500',
      stage: 'normal'
    },
    ARRIVED: {
      label: t('howToUse.statuses.ARRIVED.label'),
      description: t('howToUse.statuses.ARRIVED.description'),
      variant: 'primary',
      dotClass: 'bg-primary',
      stage: 'normal'
    },
    READY: {
      label: t('howToUse.statuses.READY.label'),
      description: t('howToUse.statuses.READY.description'),
      variant: 'primary',
      dotClass: 'bg-primary',
      stage: 'normal'
    },
    DELIVERED: {
      label: t('howToUse.statuses.DELIVERED.label'),
      description: t('howToUse.statuses.DELIVERED.description'),
      variant: 'success',
      dotClass: 'bg-emerald-500',
      stage: 'normal'
    },
    REJECTED: {
      label: t('howToUse.statuses.REJECTED.label'),
      description: t('howToUse.statuses.REJECTED.description'),
      variant: 'danger',
      dotClass: 'bg-red-500',
      stage: 'terminal'
    },
    CANCELLED: {
      label: t('howToUse.statuses.CANCELLED.label'),
      description: t('howToUse.statuses.CANCELLED.description'),
      variant: 'danger',
      dotClass: 'bg-red-500',
      stage: 'terminal'
    }
  }
}
