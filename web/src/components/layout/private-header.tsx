import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
FaHome,
FaUtensils,
FaShoppingBasket,
FaHeart,
FaUser,
FaCog,
} from 'react-icons/fa'
import ProfileOverlay from '../profile/profile-overlay'
import SettingsOverlay from '../settings/settings-overlay'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
    return (
      <>
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[var(--primary-color)] px-4 py-4 border-b border-gray-300">
    <h1 className='text-[var(--white-color)] text-5xl font-bold'>SuriHealth</h1>
    <button 
    className={`lg:hidden bg-transparent border-none cursor-pointer flex flex-col items-center ${menuOpen ? 'active' : ''}`}
    onClick={() => setMenuOpen(!menuOpen)}>
      <span className={`block w-[25px] h-[3px] my-[5px] bg-[var(--white-color)] transition-all
      duration-300 ease-in-out ${menuOpen ? 'translate-y-[12.5px] rotate-45' : ''}`}></span>
      <span className={`block w-[25px] h-[3px] my-[5px] bg-[var(--white-color)] transition-all
      duration-300 ease-in-out ${menuOpen ? 'opacity-0' : ''}`}></span>
      <span className={`block w-[25px] h-[3px] my-[5px] bg-[var(--white-color)] transition-all
      duration-300 ease-in-out ${menuOpen ? '-translate-y-[12.5px] -rotate-45' : ''}`}></span>
    </button>
     <nav className= {`lg:flex lg:flex-row lg:items-center lg:gap-11 lg:relative lg"bg-transparent lg:p-0 lg:shadow-none lg:z-auto
      ${menuOpen ? 'flex' : 'hidden'} flex-col absolute top-full right-0 w-[250px] bg-[var(--primary-color)] p-8 gap-4 shadow-custom z-[999]`}>

        <Link to="/dashboard" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-[var(--white-color)]
        text-2xl no-underline relative group">
          <FaHome />
          <span className="lg:tooltip text-white lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[var(--secondary-color)] lg:text[var(--white-color)]
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0 group-hover:lg:opacity-100 group-hover:lg:visible ">
          Startscherm</span>
        </Link>

        <Link to="/recipes" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-[var(--white-color)]/20 lg:hover:bg-transparent transition-colors duration-200 text-[var(--white-color)]
        text-2xl no-underline relative group">
          <FaUtensils />
          <span className="lg:tooltip text-[var(--white-color)] lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[var(--secondary-color)] lg:text-[var(--white-color)]
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0 group-hover:lg:opacity-100 group-hover:lg:visible">
          Recepten</span>
        </Link>

         <Link to="/shopping" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-[var(--white-color)]/20 lg:hover:bg-transparent transition-colors duration-200 text-[var(--white-color)]
        text-2xl no-underline relative group">
          <FaShoppingBasket />
          <span className="lg:tooltip text-[var(--white-color)] lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[var(--secondary-color)] lg:text-[var(--white-color)]
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0  group-hover:lg:opacity-100 group-hover:lg:visible">
          Boodschappen</span>
        </Link>

         <Link to="/favorites" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-[var(--white-color)]
        text-2xl no-underline relative group">
          <FaHeart />
          <span className="lg:tooltip text-[var(--white-color)] lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[var(--secondary-color)] lg:text-[var(--white-color)]
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0  group-hover:lg:opacity-100 group-hover:lg:visible">
          Favorieten</span>
        </Link>

        <button onClick={() => setProfileOpen(true)} className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-[var(--white-color)]
        text-2xl no-underline relative group">
          <FaUser />
          <span className="lg:tooltip text-[var(--white-color)] lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[var(--secondary-color)] lg:text-[var(--white-color)]
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0  group-hover:lg:opacity-100 group-hover:lg:visible">
          Profiel</span>
        </button>

        <button onClick={() => setSettingsOpen(true)} className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-[var(--white-color)]
        text-2xl no-underline relative group">
          <FaCog />
          <span className="lg:tooltip text-[var(--white-color)] lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[var(--secondary-color)] lg:text-[var(--white-color)]
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0  group-hover:lg:opacity-100 group-hover:lg:visible">
          Instellingen</span>
        </button> 

      </nav>
    </header>
    <ProfileOverlay
    isOpen={profileOpen}
    onClose={() => setProfileOpen(false)}></ProfileOverlay>

    <SettingsOverlay
    isOpen={settingsOpen}
    onClose={() => setSettingsOpen(false)}
    onOpenProfile={() => {
      setSettingsOpen(false);
      setProfileOpen(true);
    }}></SettingsOverlay>
    </>
    )
}