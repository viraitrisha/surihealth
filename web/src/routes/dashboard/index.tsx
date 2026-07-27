import { createFileRoute } from '@tanstack/react-router'
import WelcomeCard from '../../components/dashboard/welcome-card'
import FoodPreview from '../../components/dashboard/food-preview'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  return(
    <>
    <div>
       <main>
        <WelcomeCard/>
        <FoodPreview/>
       </main>
    </div>
    </>
  )
}