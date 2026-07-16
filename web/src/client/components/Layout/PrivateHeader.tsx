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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
    return (
       <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[var(--primary-color)] px-4 py-4 border-b border-gray-300">
    <h1 className='text-[var(--white-color)] text-5xl font-bold'>SuriHealth</h1>
    <button 
    className={`lg:hidden bg-transparent border-none cursor-pointer flex flex-col items-center ${menuOpen ? 'active' : ''}`}
    onClick={() => setMenuOpen(!menuOpen)}>
      <span className={`block w-[25px] h-[3px] my-[5px] bg-white transition-all
      duration-300 ease-in-out ${menuOpen ? 'translate-y-[12.5px] rotate-45' : ''}`}></span>
      <span className={`block w-[25px] h-[3px] my-[5px] bg-white transition-all
      duration-300 ease-in-out ${menuOpen ? 'opacity-0' : ''}`}></span>
      <span className={`block w-[25px] h-[3px] my-[5px] bg-white transition-all
      duration-300 ease-in-out ${menuOpen ? '-translate-y-[12.5px] -rotate-45' : ''}`}></span>
    </button>
     <nav className= {`lg:flex lg:flex-row lg:items-center lg:gap-11 lg:relative lg"bg-transparent lg:p-0 lg:shadow-none lg:z-auto
      ${menuOpen ? 'flex' : 'hidden'} flex-col absolute top-full right-0 w-[250px] bg-[#1a756a] p-8 gap-4 shadow-custom z-[999]`}>

        <Link to="/dashboard" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-white
        text-2xl no-underline relative group">
          <FaHome />
          <span className="lg:tooltip text-white lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[#2D9C8F] lg:text-white
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0 group-hover:lg:opacity-100 group-hover:lg:visible ">
          Startscherm</span>
        </Link>

        <Link to="/recipes" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-white
        text-2xl no-underline relative group">
          <FaUtensils />
          <span className="lg:tooltip text-white lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[#2D9C8F] lg:text-white
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0 group-hover:lg:opacity-100 group-hover:lg:visible">
          Recepten</span>
        </Link>

         <Link to="/boodschappen" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-white
        text-2xl no-underline relative group">
          <FaShoppingBasket />
          <span className="lg:tooltip text-white lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[#2D9C8F] lg:text-white
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0  group-hover:lg:opacity-100 group-hover:lg:visible">
          Boodschappen</span>
        </Link>

         <Link to="/favorites" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-white
        text-2xl no-underline relative group">
          <FaHeart />
          <span className="lg:tooltip text-white lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[#2D9C8F] lg:text-white
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0  group-hover:lg:opacity-100 group-hover:lg:visible">
          Favorieten</span>
        </Link>

        <Link to="/profile" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-white
        text-2xl no-underline relative group">
          <FaUser />
          <span className="lg:tooltip text-white lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[#2D9C8F] lg:text-white
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0  group-hover:lg:opacity-100 group-hover:lg:visible">
          Profiel</span>
        </Link>

        <Link to="/settings" className="nav-icon flex items-center lg:flex-col lg:justify-center w-full lg:w-auto py-4 px-6
        lg:p-0 rounded-full lg:rounded-none hover:bg-white/20 lg:hover:bg-transparent transition-colors duration-200 text-white
        text-2xl no-underline relative group">
          <FaCog />
          <span className="lg:tooltip text-white lg:absolute lg:top-[4rem] lg:left-1/2 lg:-translate-x-1/2 lg:bg-[#2D9C8F] lg:text-white
          lg:px-3 lg:py-1.5 lg:rounded-2xl lg:text-tooltip lg:whitespace-nowrap lg:opacity-0 lg:invisble lg:pointer-events-none
          lg:transition-opacity lg:duration-200 lg:z-10 lg:min-w-tooltip lg:text-center lg:hover:opacity-100 lg:hover:visible static
          opacity-100 visible bg-transparent p-0 text-xl ml-3 lg:ml-0  group-hover:lg:opacity-100 group-hover:lg:visible">
          Instellingen</span>
        </Link> 

      </nav>
    </header>
    )
}



// import { useState } from 'react'
// import { Link } from '@tanstack/react-router'
// import {
// FaHome,
// FaUtensils,
// FaShoppingBasket,
// FaHeart,
// FaUser,
// FaCog,
// } from 'react-icons/fa'

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false)
//     return (
//     <header className="header">
//     <h1>SuriHealth</h1>
//     <button
//     className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
//     onClick={() => setMenuOpen(!menuOpen)}>
//       <span className='bar'></span>
//       <span className='bar'></span>
//       <span className='bar'></span>
//     </button>
//      <nav className= {`nav ${menuOpen ? 'active' : ''}`}>

//         <Link to="/dashboard" className="nav-icon">
//           <FaHome />
//           <span className="tooltip">Startscherm</span>
//         </Link>

//         <Link to="/recipes" className="nav-icon">
//           <FaUtensils />
//           <span className="tooltip">Recepten</span>
//         </Link>

//          <Link to="/shopping" className="nav-icon">
//           <FaShoppingBasket />
//           <span className="tooltip">Boodschappen</span>
//         </Link>

//          <Link to="/favorites" className="nav-icon">
//           <FaHeart />
//           <span className="tooltip">Favorieten</span>
//         </Link>

//         <Link to="/profile" className="nav-icon">
//           <FaUser />
//           <span className="tooltip">Profiel</span>
//         </Link>

//         <Link to="/settings" className="nav-icon">
//           <FaCog />
//           <span className="tooltip">Instellingen</span>
//         </Link> 

//       </nav>
//     </header>
//     )
// }