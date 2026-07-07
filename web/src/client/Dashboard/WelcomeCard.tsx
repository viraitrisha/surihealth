import { Link } from "@tanstack/react-router";

export default function WelcomeCard() {
    return (
        <section className="bg-[#e8f5f3] w-[90%] max-w-[80rem] mx-auto my-16 p-12 text-center
        rounded-2xl shadow-custom transition-transform duration-200 hover:-translate-y-1">
            <h2 className="mt-0 mb-4 text-black text-2xl font-bold">Welkom, gebruiker</h2>
            <p className="mb-8 text-[1.8rem]">Wilt u automatisch dagelijkse recepten ontvangen of handmatig instellen?</p>

            <div>
              <Link to= "/automatisch" className="inline-block no-underline bg-secondary text-black mt-4 mr-4 border-none
              py-4 px-8 rounded-[4rem] cursor-pointer text-[1.6rem] font-bold transition-all duration-200 hover:bg-primary
              hover:-translate-y-1 hover:shadow-custom">
              automatisch
              </Link>

              <Link to= "/handmatig" className="btn">
              handmatig
              </Link>
            </div>
        </section>
    )
}