import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/NavBar.css';
import { IoIosThunderstorm } from "react-icons/io";
import { FaUser } from 'react-icons/fa';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserStatus = () => {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      } else {
        setUser(null);
      }
    };

    checkUserStatus();
    window.addEventListener('userLogin', checkUserStatus);
    window.addEventListener('storage', checkUserStatus);

    return () => {
      window.removeEventListener('userLogin', checkUserStatus);
      window.removeEventListener('storage', checkUserStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="nav-container">
      <div className="nav-brand">
        <Link to="/" className="nav-logo"><IoIosThunderstorm /></Link>
      </div>
      <div className="nav-links">
        {!user && (
          <>
            <Link 
              to="/register" 
              className={`nav-button ${location.pathname === '/register' ? 'active' : ''}`}
            >
              Register
            </Link>
            <Link 
              to="/login" 
              className={`nav-button ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Log In
            </Link>
          </>
        )}
        {user && (
          <>
            <Link to="/profile" className="nav-link">
              <FaUser /> Profile
            </Link>
            <button onClick={handleLogout} className="nav-link">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
