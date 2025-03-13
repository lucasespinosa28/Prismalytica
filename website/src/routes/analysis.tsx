import { createFileRoute } from '@tanstack/react-router'
import { AnalysisDashboard } from '../components/Analysis/AnalysisDashboard'

export const Route = createFileRoute('/analysis')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AnalysisDashboard/>
}
