import { createFileRoute, Link } from '@tanstack/react-router'
import '../styles/automatisch.css'
import Header from '#/client/components/Layout/PrivateHeader'
import Footer from '#/client/components/Layout/Footer.tsx'

export const Route = createFileRoute('/automatisch')({
  component: RouteComponent,
})

function RouteComponent() {
  return( 
    <>
    <Header />
  <div>
    <main className='page'>
        <section className='plan-title'>
            <h1>Automatisch Plan</h1>
        </section>

        <section className='plan-wrapper'>
            <div className='plan-left'>
                <h2>
                    Welkom, <span>Gebruiker</span>
                </h2>
                <p>Vandaag - (d/m/j)</p>
                <h3>Wist je dat?</h3>
                <p>
                    Mensen gezondere keuzes maken wanneer maaltijden van te voren worden gepland.
                </p>
            </div>

            <div className='plan-right'>
                <div className='meal-card'>
                    <h3>Ontbijt</h3>
                    <p></p>
                    <Link to='/recipes' className='btn'>
                    Recept
                    </Link>
                </div>
                 <div className='meal-card'>
                    <h3>Lunch</h3>
                    <p></p>
                     <Link to="/recipes" className="btn">
                     Recept
                     </Link>
                </div>
                 <div className='meal-card'>
                    <h3>Avond maaltijd</h3>
                    <p></p>
                     <Link to="/recipes" className="btn">
                     Recept
                     </Link>
                </div>
            </div>
        </section>

    </main>
    </div> 
  <Footer />
  </>
)
}
