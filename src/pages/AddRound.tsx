
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useGolfData } from '../context/GolfDataContext';
import { ChevronLeft } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/add-round.css';

const AddRound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPlayerId = location.state?.playerId || '';
  const initialCourseId = location.state?.courseId || '';
  
  const { players, courses, addRound, loading } = useGolfData();
  
  const [formData, setFormData] = useState({
    playerId: initialPlayerId,
    courseId: initialCourseId,
    date: new Date().toISOString().split('T')[0],
    score: '',
    notes: '',
  });

  const [errors, setErrors] = useState({
    playerId: false,
    courseId: false,
    score: false,
  });

  // If there are no players or courses, redirect to the appropriate page
  useEffect(() => {
    if (!loading) {
      if (players.length === 0) {
        navigate('/players', { replace: true });
      } else if (courses.length === 0) {
        navigate('/courses', { replace: true });
      }
    }
  }, [players, courses, navigate, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error for this field
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      playerId: !formData.playerId,
      courseId: !formData.courseId,
      score: !formData.score || isNaN(Number(formData.score)) || Number(formData.score) <= 0,
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }
    
    // Add the round
    addRound({
      playerId: formData.playerId,
      courseId: formData.courseId,
      date: formData.date,
      score: Number(formData.score),
      notes: formData.notes.trim() || undefined,
    });
    
    // Navigate back to rounds page
    navigate('/rounds');
  };

  return (
    <div className="add-round-container">
      <div className="add-round-header">
        <Link to="/rounds" className="btn btn-outline back-button">
          <ChevronLeft className="btn-icon-left" />
          Back
        </Link>
        <h1 className="add-round-title">Add New Round</h1>
      </div>
      
      <div className="add-round-card">
        <div className="card-header">
          <h2 className="card-title">Round Details</h2>
          <p className="card-description">
            Record a new golf round with player, course, and score information.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card-content">
            <div className="form-group">
              <label htmlFor="player" className="form-label">Player</label>
              <select 
                id="player"
                className={`form-select ${errors.playerId ? 'error' : ''}`}
                value={formData.playerId}
                onChange={(e) => handleChange('playerId', e.target.value)}
              >
                <option value="">Select a player</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>
              {errors.playerId && (
                <p className="error-message">Please select a player</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="course" className="form-label">Course</label>
              <select 
                id="course"
                className={`form-select ${errors.courseId ? 'error' : ''}`}
                value={formData.courseId}
                onChange={(e) => handleChange('courseId', e.target.value)}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.tees})
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <p className="error-message">Please select a course</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="date" className="form-label">Date Played</label>
              <input
                id="date"
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="score" className="form-label">Total Score</label>
              <input
                id="score"
                type="number"
                className={`form-input ${errors.score ? 'error' : ''}`}
                placeholder="Enter total score"
                value={formData.score}
                onChange={(e) => handleChange('score', e.target.value)}
              />
              {errors.score && (
                <p className="error-message">Please enter a valid score</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="notes" className="form-label">Notes (optional)</label>
              <textarea
                id="notes"
                className="form-textarea"
                placeholder="Add any notes about this round..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="card-footer">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate('/rounds')}
            >
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Round
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRound;