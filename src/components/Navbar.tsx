
import { Link, useLocation } from 'react-router-dom';
import { GolfClub } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <GolfClub className="h-6 w-6" />
            <span className="font-bold text-xl">Golf Tracker</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/players" 
              className={`${isActive('/players') ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Players
            </Link>
            <Link 
              to="/courses" 
              className={`${isActive('/courses') ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Courses
            </Link>
            <Link 
              to="/rounds" 
              className={`${isActive('/rounds') ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Rounds
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t">
        <div className="grid grid-cols-4 text-xs">
          <Link 
            to="/" 
            className={`py-3 text-center ${isActive('/') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/players" 
            className={`py-3 text-center ${isActive('/players') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            Players
          </Link>
          <Link 
            to="/courses" 
            className={`py-3 text-center ${isActive('/courses') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            Courses
          </Link>
          <Link 
            to="/rounds" 
            className={`py-3 text-center ${isActive('/rounds') ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            Rounds
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;