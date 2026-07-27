import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/handmatig')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/__dashboard/handmatig"!</div>
}
