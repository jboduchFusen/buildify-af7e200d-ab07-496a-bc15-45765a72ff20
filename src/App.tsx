
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Courses from './pages/Courses';
import Rounds from './pages/Rounds';
import PlayerDetail from './pages/PlayerDetail';
import CourseDetail from './pages/CourseDetail';
import AddRound from './pages/AddRound';
import { GolfDataProvider } from './context/GolfDataContext';
import './styles/global.css';

function App() {
  return (
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GolfDataProvider>
  );
}

export default App;