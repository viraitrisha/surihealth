import { createFileRoute, Link } from '@tanstack/react-router'
import '../styles/handmatig.css'
import Header from '#/client/components/Layout/PrivateHeader'
import Footer from '#/client/components/Layout/Footer'
export const Route = createFileRoute('/handmatig')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <Header />
    <div>
      <main> 
        <section className='plan-title'>
          <h1>Handmatig Plan</h1> 
        </section>

        <section className='plan-wrapper'>
          <div className='plan-left'>
            <h2>
              Welkom, <span>Gebruiker</span>
            </h2>
            <p>Vandaag - (d/m/j)</p>
            <Link to='/recipes' className='btn'>
            Recept
            </Link>
          </div>

          <div className='plan-right'>
            <img src="/placeholder.png"></img>
          </div>
        </section>
      </main>
    </div>

    <Footer />
    </>
  )

}
