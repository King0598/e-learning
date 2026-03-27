import React from 'react'
import Logo from '../assets/logo.png'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Check if current path is a dashboard
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <div className='navbar'>
      <img src={Logo} alt='Logo' width={250} />

      {!isDashboard && (
        <>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/about'>About Us</Link></li>
            <li><Link to='/contact'>Contact Us</Link></li>
          </ul>
          <div className="navbar-right">
            <button onClick={() => navigate("/signup")} className="create-account-btn">
              <Link to='/signup'>Create Account</Link>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Navbar
