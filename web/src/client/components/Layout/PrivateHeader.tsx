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
    <header className="header">
    <h1>SuriHealth</h1>
    <button
    className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
    onClick={() => setMenuOpen(!menuOpen)}>
      <span className='bar'></span>
      <span className='bar'></span>
      <span className='bar'></span>
    </button>
     <nav className= {`nav ${menuOpen ? 'active' : ''}`}>

        <Link to="/dashboard" className="nav-icon">
          <FaHome />
          <span className="tooltip">Startscherm</span>
        </Link>

        <Link to="/recipes" className="nav-icon">
          <FaUtensils />
          <span className="tooltip">Recepten</span>
        </Link>

         <Link to="/shopping" className="nav-icon">
          <FaShoppingBasket />
          <span className="tooltip">Boodschappen</span>
        </Link>

         <Link to="/favorites" className="nav-icon">
          <FaHeart />
          <span className="tooltip">Favorieten</span>
        </Link>

        <Link to="/profile" className="nav-icon">
          <FaUser />
          <span className="tooltip">Profiel</span>
        </Link>

        <Link to="/settings" className="nav-icon">
          <FaCog />
          <span className="tooltip">Instellingen</span>
        </Link> 

      </nav>
    </header>
    )
}

// function Header() {
//     return(
//         <header>
//             <h1>Surihealth</h1>
//              <nav>
//                <ul>
//                     <li><a href="#">Startscherm</a></li>
//                     <li><a href="#">Recepten</a></li>
//                     <li><a href="#">Boodschappen</a></li>
//                     <li><a href="#">Favorieten</a></li>
//                     <li><a href="#">Profiel</a></li>
//                     <li><a href="#">Instellingen</a></li>
//                 </ul>
//            </nav>
//         </header>
//     );
// }

// export default Header 
