import { createFileRoute, Link } from '@tanstack/react-router'
// import '../styles/handmatig.css'
import Header from '#/components/layout/private-header'
import Footer from '#/client/components/Layout/Footer'
export const Route = createFileRoute('/_dashboard/handmatig')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <Header />
    <div>
      <main className='min-h-screen pt-[50px]'> 
        <section className='bg-[var(--welcome-card-color)] text-[var(--black-color)] text-center py-8 px-4 text-2xl font-bold border-b-2 border-[var(--secondary-color)]'>
          <h1 className='m-0 text-[2.8rem]'>Handmatig Plan</h1> 
        </section>

        <section className='flex flex-wrap gap-12 max-w[120rem] mx-auto my-12 px-8'>
          <div className='flex-1 min-w-[25rem] bg-[var(--white-color)] p-12 rounded-2xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)]
          flex flex-col justify-start transition-transform duration-200 hover:-translate-y-1'>
            <h2 className='text-[var(--primary-color)] text-[2.4rem] mt-0'>
              Welkom, <span>Gebruiker</span>
            </h2>
            <p className='text-[1.8rem] leading-relaxed text-[var(--black-color)] my-4'>Vandaag - (d/m/j)</p>
            <Link to='/recipes' className='inline-block self-start no-underline bg-[var(--secondary-color)] text-[var(--white-color)] mt-8 border-none py-3 px-8 rounded-[4rem] cursor-pointer text-[1.6rem]
                    font-bold transition-all duration-200 hover:bg-[var(--primary-color)] hover:-translate-y-1 hover:shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)]'>
            Recept
            </Link>
          </div>

          <div className='flex-[2] min-w-[25rem] flex items-center justify-center overflow-hidden rounded-2xl shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] bg-[var(--welcome-card-color)] '>
            <img src="/placeholder.png" alt='Handmatig plan' className='w-full h-[45rem] object-cover block transition-transform duration-200 hover:scale-105' ></img>
          </div>
        </section>
      </main>
    </div>

    <Footer />
    </>
  )

}
