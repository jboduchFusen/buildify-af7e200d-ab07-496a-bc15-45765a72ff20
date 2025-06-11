
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Courses from './pages/Courses';
import Rounds from './pages/Rounds';
import PlayerDetail from './pages/PlayerDetail';
import CourseDetail from './pages/CourseDetail';
import AddRound from './pages/AddRound';
import Login from './pages/Login';
import Register from './pages/Register';
import { GolfDataProvider } from './context/GolfDataContext';
import { AuthProvider } from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import './styles/global.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GolfDataProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="players" element={<Players />} />
                <Route path="players/:id" element={<PlayerDetail />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<CourseDetail />} />
                <Route path="rounds" element={<Rounds />} />
                <Route path="rounds/add" element={<AddRound />} />
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </GolfDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
