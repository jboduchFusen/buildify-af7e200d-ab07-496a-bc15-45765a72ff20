
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ThemeProvider } from '@/components/theme-provider';

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="golf-tracker-theme">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-6 px-4">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;