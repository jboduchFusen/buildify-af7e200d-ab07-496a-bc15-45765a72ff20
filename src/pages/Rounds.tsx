
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGolfData, Round } from '../context/GolfDataContext';
import { PlusCircle, MoreHorizontal, Search, Trophy, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/rounds.css';

const Rounds = () => {
  const location = useLocation();
  const initialPlayerId = location.state?.playerId || '';
  const initialCourseId = location.state?.courseId || '';
  
  const { rounds, players, courses, deleteRound, loading } = useGolfData();
  const [searchQuery, setSearchQuery] = useState('');
  const [playerFilter, setPlayerFilter] = useState(initialPlayerId);
  const [courseFilter, setCourseFilter] = useState(initialCourseId);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Reset filters when navigating away
  useEffect(() => {
    return () => {
      setPlayerFilter('');
      setCourseFilter('');
      setSearchQuery('');
    };
  }, []);

  const toggleDropdown = (roundId: string) => {
    setActiveDropdown(activeDropdown === roundId ? null : roundId);
  };

  const handleDeleteRound = (id: string) => {
    if (window.confirm('Are you sure you want to delete this round?')) {
      deleteRound(id);
      setActiveDropdown(null);
    }
  };

  const filteredRounds = rounds.filter(round => {
    const player = players.find(p => p.id === round.playerId);
    const course = courses.find(c => c.id === round.courseId);
    
    // Apply player filter
    if (playerFilter && round.playerId !== playerFilter) {
      return false;
    }
    
    // Apply course filter
    if (courseFilter && round.courseId !== courseFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const playerMatch = player && player.name.toLowerCase().includes(searchLower);
      const courseMatch = course && course.name.toLowerCase().includes(searchLower);
      const dateMatch = new Date(round.date).toLocaleDateString().toLowerCase().includes(searchLower);
      const scoreMatch = round.score.toString().includes(searchLower);
      
      return playerMatch || courseMatch || dateMatch || scoreMatch;
    }
    
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const clearFilters = () => {
    setPlayerFilter('');
    setCourseFilter('');
    setSearchQuery('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="rounds-container">
      <div className="rounds-header">
        <h1 className="rounds-title">Rounds</h1>
        <Link to="/rounds/add" className="btn btn-primary">
          <PlusCircle className="btn-icon-left" />
          Add Round
        </Link>
      </div>

      <div className="search-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search rounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filters-group">
          <div className="select-container">
            <select 
              className="form-select select"
              value={playerFilter}
              onChange={(e) => setPlayerFilter(e.target.value)}
            >
              <option value="">All Players</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
          </div>
          
          <div className="select-container">
            <select 
              className="form-select select"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {(playerFilter || courseFilter || searchQuery) && (
          <button 
            className="clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {rounds.length === 0 ? (
        <div className="empty-rounds">
          <div className="empty-icon-container">
            <Trophy className="empty-icon" />
          </div>
          <h2 className="empty-title">No rounds yet</h2>
          <p className="empty-description">
            You haven't recorded any golf rounds yet. Add your first round to start tracking your progress.
          </p>
          <Link to="/rounds/add" className="btn btn-primary">
            <PlusCircle className="btn-icon-left" />
            Add Round
          </Link>
        </div>
      ) : filteredRounds.length === 0 ? (
        <div className="no-matching-rounds">
          <h2 className="no-matching-title">No matching rounds</h2>
          <p className="no-matching-description">
            No rounds match your current filters. Try adjusting your search or filters.
          </p>
          <button 
            className="btn btn-outline"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <table className="rounds-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Player</th>
              <th>Course</th>
              <th>Score</th>
              <th>vs Par</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRounds.map(round => {
              const { getPlayerById, getCourseById } = useGolfData();
              const player = getPlayerById(round.playerId);
              const course = getCourseById(round.courseId);
              
              const scoreToPar = course ? round.score - course.par : null;
              const scoreToParDisplay = scoreToPar !== null 
                ? (scoreToPar === 0 ? 'E' : (scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar)) 
                : '-';
              
              const scoreToParClass = scoreToPar === 0 ? 'even' : (scoreToPar && scoreToPar > 0 ? 'over' : 'under');
              
              return (
                <tr key={round.id}>
                  <td>{new Date(round.date).toLocaleDateString()}</td>
                  <td>
                    {player && (
                      <Link to={`/players/${player.id}`} className="player-link">
                        {player.name}
                      </Link>
                    )}
                  </td>
                  <td>
                    {course && (
                      <Link to={`/courses/${course.id}`} className="course-link">
                        {course.name}
                      </Link>
                    )}
                  </td>
                  <td className="score">{round.score}</td>
                  <td className={`score-to-par ${scoreToParClass}`}>{scoreToParDisplay}</td>
                  <td>
                    <div className="dropdown">
                      <button 
                        className="dropdown-button"
                        onClick={() => toggleDropdown(round.id)}
                      >
                        <MoreHorizontal />
                      </button>
                      {activeDropdown === round.id && (
                        <div className="dropdown-menu">
                          <div className="dropdown-label">Actions</div>
                          <div className="dropdown-separator"></div>
                          {player && (
                            <Link 
                              to={`/players/${player.id}`} 
                              className="dropdown-item"
                              onClick={() => setActiveDropdown(null)}
                            >
                              View player
                            </Link>
                          )}
                          {course && (
                            <Link 
                              to={`/courses/${course.id}`} 
                              className="dropdown-item"
                              onClick={() => setActiveDropdown(null)}
                            >
                              View course
                            </Link>
                          )}
                          <div className="dropdown-separator"></div>
                          <button 
                            className="dropdown-item destructive"
                            onClick={() => handleDeleteRound(round.id)}
                          >
                            <Trash2 className="dropdown-icon" />
                            Delete round
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Rounds;