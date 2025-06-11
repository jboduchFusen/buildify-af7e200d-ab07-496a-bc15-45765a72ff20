
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { GolfDataProvider } from './context/GolfDataContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GolfDataProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="players" element={<Players />} />
              <Route path="players/:id" element={<PlayerDetail />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="rounds" element={<Rounds />} />
              <Route path="rounds/add" element={<AddRound />} />
            </Route>
          </Routes>
        </Router>
      </GolfDataProvider>
    </QueryClientProvider>
  );
}

export default App;