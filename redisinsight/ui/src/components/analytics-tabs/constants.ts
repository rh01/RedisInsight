import { AnalyticsViewTab } from 'uiSrc/slices/interfaces/analytics'

interface AnalyticsTabs {
  id: AnalyticsViewTab,
  label: string,
}

export const analyticsViewTabs: AnalyticsTabs[] = [
  {
    id: AnalyticsViewTab.ClusterDetails,
    label: 'Overview',
  },
  {
    id: AnalyticsViewTab.MemoryEfficiency,
    label: 'Memory efficiency',
  },
  {
    id: AnalyticsViewTab.SlowLog,
    label: 'Slow Log',
  },
]
