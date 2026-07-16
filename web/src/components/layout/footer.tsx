function Footer(){
    return(
        <footer className="fixed bottom-0 left-0 right-0 bg-[#1A756A] text-white font-bold py-4 px-8
        shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)] transition-all duration-300">
        <p>&copy;{new Date().getFullYear()}SuriHealth</p>
        </footer>
    )
}

export default Footer