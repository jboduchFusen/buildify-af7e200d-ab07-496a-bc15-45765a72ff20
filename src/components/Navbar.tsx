
import { Link, useLocation } from 'react-router-dom';
import { GolfClub } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <GolfClub className="navbar-logo" />
            <span className="navbar-title">Golf Tracker</span>
          </Link>
          
          <div className="navbar-links desktop-only">
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/players" 
              className={`navbar-link ${isActive('/players') ? 'active' : ''}`}
            >
              Players
            </Link>
            <Link 
              to="/courses" 
              className={`navbar-link ${isActive('/courses') ? 'active' : ''}`}
            >
              Courses
            </Link>
            <Link 
              to="/rounds" 
              className={`navbar-link ${isActive('/rounds') ? 'active' : ''}`}
            >
              Rounds
            </Link>
          </div>
        </div>
        
        <div className="navbar-right">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="mobile-nav">
        <Link 
          to="/" 
          className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/players" 
          className={`mobile-nav-link ${isActive('/players') ? 'active' : ''}`}
        >
          Players
        </Link>
        <Link 
          to="/courses" 
          className={`mobile-nav-link ${isActive('/courses') ? 'active' : ''}`}
        >
          Courses
        </Link>
        <Link 
          to="/rounds" 
          className={`mobile-nav-link ${isActive('/rounds') ? 'active' : ''}`}
        >
          Rounds
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;