import { createFileRoute } from '@tanstack/react-router'
import ProfileOverlay from '#/components/profile/profile-overlay'

export const Route = createFileRoute('/_profile/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ProfileOverlay
    isOpen={true}
    onClose={() => {}}></ProfileOverlay>
  )
}
