// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/dashboard')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/dashboard"!</div>
// }

import { createFileRoute } from '@tanstack/react-router'
// import '../styles/dashboard.css'
import WelcomeCard from '../../components/dashboard/welcome-card'
import FoodPreview from '#/components/dashboard/food-preview'
import Header from '../../components/layout/private-header'
import Footer from '#/components/layout/footer'
export const Route = createFileRoute('/_dashboard/dashboard')({
  component: Dashboard,
})

function Dashboard(){
  return(
    <>
    <Header />
    <div>
       <main>
        <WelcomeCard/>
        <FoodPreview/>
       </main>
       <Footer/>
    </div>
    </>
  )
}
