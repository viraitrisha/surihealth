import { createFileRoute, Link } from '@tanstack/react-router'
// import '../styles/automatisch.css'
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
    <main className='min-h-screen'>
        <section className='bg-[#e8f5f3] text-black text-center py-8 px-4 text-2xl font-bold border-b-2 border-[#2D9C8F]'>
            <h1 className='m-0 text-[2.8rem]j'>Automatisch Plan</h1>
        </section>

        <section className='flex flex-wrap justify-center gap-12 max-w-[120rem] mx-auto my-12 px-8'>
            <div className='flex-[2] min-w-[25rem] bg-white p-12 rounded-2xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] transition-transform duration-200 hover:-translate-y-1'>
                <h2 className='text-[#2D9C8F]'>
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
