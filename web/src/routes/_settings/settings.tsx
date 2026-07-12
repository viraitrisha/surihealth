import { createFileRoute } from '@tanstack/react-router'
import SettingsOverlay from '#/components/settings/settings-overlay'

export const Route = createFileRoute('/_settings/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SettingsOverlay
      isOpen={true}
      onClose={() =>{}}
      onOpenProfile={() => {}}
    ></SettingsOverlay>
  )
}
