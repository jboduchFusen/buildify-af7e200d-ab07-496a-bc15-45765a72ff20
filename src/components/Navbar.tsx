
import { Link, useLocation } from 'react-router-dom';
import { GolfClub, User, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from './AuthProvider';
import { useState, useRef, useEffect } from 'react';
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
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
          
          <div className="user-menu-container" ref={userMenuRef}>
            <button 
              className="user-menu-button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <User className="user-icon" />
            </button>
            
            {userMenuOpen && (
              <div className="user-menu">
                <div className="user-menu-header">
                  <span className="user-email">{user?.email}</span>
                </div>
                <div className="user-menu-divider"></div>
                <button className="user-menu-item" onClick={handleSignOut}>
                  <LogOut className="user-menu-icon" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
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
