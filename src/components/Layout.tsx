
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ThemeProvider } from './ThemeProvider';
import '../styles/layout.css';

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="golf-tracker-theme">
      <div className="layout">
        <Navbar />
        <main className="container main-content">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;