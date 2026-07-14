import { createFileRoute, Link } from '@tanstack/react-router'
// import '../styles/automatisch.css'
import Header from '#/components/layout/private-header'
import Footer from '#/client/components/Layout/Footer.tsx'

export const Route = createFileRoute('/_dashboard/automatisch')({
  component: RouteComponent,
})

function RouteComponent() {
  return( 
    <>
    <Header />
  <div>
    <main className='min-h-screen pt-[50px]'>
        <section className='bg-[var(--welcome-card-color)] text-[var(--black-color)] text-center py-8 px-4 text-2xl font-bold border-b-2 border-[var(--secondary-color)]'>
            <h1 className='m-0 text-[2.8rem]'>Automatisch Plan</h1>
        </section>

        <section className='flex flex-wrap justify-center gap-12 max-w-[120rem] mx-auto my-12 px-8'>
            <div className='flex-[2] min-w-[25rem] bg-[var(--white-color)] p-12 rounded-2xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] transition-transform duration-200 hover:-translate-y-1'>
                <h2 className='text-[var(--primary-color)] text-[2.4rem] mt-0'>
                    Welkom, <span>Gebruiker</span>
                </h2>
                <p className='text-[1.8rem] leading-relaxed text-[var(--black-color)]'>Vandaag - (d/m/j)</p>
                <h3 className='font-bold text-[var(--accent-color)] text-2xl mt-8'>Wist je dat?</h3>
                <p className='text-[1.8rem] leading-relaxed text-[var(--black-color)]'>
                    Mensen gezondere keuzes maken wanneer maaltijden van te voren worden gepland.
                </p>
            </div>

            <div className='flex-1 min-w-[28rem] flex flex-col gap-8'>
                <div className='bg-[var(--welcome-card-color)] p-8 rounded-2xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] text-center transition-transform duration-200 hover:-translate-y-1'>
                    <h3 className='text-[var(--primary-color)] text-2xl mt-0 border-b-2 border-[var(--secondary-color)] inline-block pb-2'>Ontbijt</h3>
                    <p></p>
                    <Link to='/recipes' className='inline-block no-underline bg-[var(--secondary-color)] text-[var(--white-color)] mt-4 border-none py-3 px-8 rounded-[4rem] cursor-pointer text-[1.6rem]
                    font-bold transition-all duration-200 hover:bg-[var(--secondary-color)] hover:-translate-y-1 hover:shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)]'>
                    Recept
                    </Link>
                </div>
                 <div className='bg-[var(--welcome-card-color)] p-8 rounded-2xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] text-center transition-transform duration-200 hover:-translate-y-1'>
                    <h3 className='text-[var(--primary-color)] text-2xl mt-0 border-b-2 border-[var(--secondary-color)] inline-block pb-2'>Lunch</h3>
                    <p></p>
                     <Link to="/recipes" className='inline-block no-underline bg-[var(--secondary-color)] text-[var(--white-color)] mt-4 border-none py-3 px-8 rounded-[4rem] cursor-pointer text-[1.6rem]
                    font-bold transition-all duration-200 hover:bg-[var(--primary-color)] hover:-translate-y-1 hover:shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)]>'>
                     Recept
                     </Link>
                </div>
                 <div className='bg-[var(--welcome-card-color)] p-8 rounded-2xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] text-center transition-transform duration-200 hover:-translate-y-1'>
                    <h3 className='text-[var(--primary-color)] text-2xl mt-0 border-b-2 border-[var(--secondary-color)] inline-block pb-2'>Avond maaltijd</h3>
                    <p></p>
                     <Link to="/recipes" className='inline-block no-underline bg-[var(--secondary-color)] text-[var(--white-color)] mt-4 border-none py-3 px-8 rounded-[4rem] cursor-pointer text-[1.6rem]
                    font-bold transition-all duration-200 hover:bg-[var(--primary-color)] hover:-translate-y-1 hover:shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)]>'>
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
