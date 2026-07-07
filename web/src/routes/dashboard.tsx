// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/dashboard')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/dashboard"!</div>
// }

import { createFileRoute } from '@tanstack/react-router'
// import '../styles/dashboard.css'
import WelcomeCard from '../client/Dashboard/WelcomeCard'
import FoodPreview from '#/client/Dashboard/FoodPreview'
import Header from '../client/components/Layout/PrivateHeader'
import Footer from '#/client/components/Layout/Footer'
export const Route = createFileRoute('/dashboard')({
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
