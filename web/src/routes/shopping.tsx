import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shopping')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/shopping"!</div>
}
