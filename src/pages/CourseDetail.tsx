
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGolfData } from '../context/GolfDataContext';
import { ChevronLeft, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/player-detail.css'; // Reusing the same styles

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getCourseById, 
    getCourseRounds, 
    getPlayerById, 
    updateCourse, 
    deleteCourse,
    deleteRound,
    loading
  } = useGolfData();

  if (loading) {
    return <LoadingSpinner />;
  }

  const course = getCourseById(id || '');
  
  if (!course) {
    return (
      <div className="not-found">
        <h2>Course Not Found</h2>
        <p>The course you're looking for doesn't exist or has been deleted.</p>
        <Link to="/courses" className="btn btn-primary">
          <ChevronLeft className="btn-icon-left" />
          Back to Courses
        </Link>
      </div>
    );
  }

  const courseRounds = getCourseRounds(course.id).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedCourse, setEditedCourse] = useState({
    name: course.name,
    holes: course.holes,
    par: course.par,
    slope: course.slope,
    rating: course.rating,
    tees: course.tees,
    location: course.location || '',
  });

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedCourse.name.trim()) {
      updateCourse(course.id, {
        name: editedCourse.name.trim(),
        holes: Number(editedCourse.holes),
        par: Number(editedCourse.par),
        slope: Number(editedCourse.slope),
        rating: Number(editedCourse.rating),
        tees: editedCourse.tees.trim(),
        location: editedCourse.location.trim() || undefined,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteCourse = () => {
    let confirmMessage = `Are you sure you want to delete ${course.name}?`;
    if (courseRounds.length > 0) {
      confirmMessage += ` This will also delete ${courseRounds.length} associated rounds.`;
    }
    
    if (window.confirm(confirmMessage)) {
      deleteCourse(course.id);
      navigate('/courses');
    }
  };

  const handleDeleteRound = (roundId: string) => {
    if (window.confirm('Are you sure you want to delete this round?')) {
      deleteRound(roundId);
    }
  };

  // Calculate average score on this course
  const calculateAverageScore = () => {
    if (courseRounds.length === 0) return 'N/A';
    const totalScore = courseRounds.reduce((sum, round) => sum + round.score, 0);
    return (totalScore / courseRounds.length).toFixed(1);
  };

  return (
    <div className="player-detail-container">
      <div className="player-detail-header">
        <Link to="/courses" className="btn btn-outline back-button">
          <ChevronLeft className="btn-icon-left" />
          Back
        </Link>
        <h1 className="player-name">{course.name}</h1>
      </div>

      <div className="player-cards">
        <div className="player-card">
          <div className="player-card-header">
            <h2 className="player-card-title">Course Details</h2>
            <p className="player-card-description">View and manage course information</p>
          </div>
          <div className="player-card-content">
            <div className="player-details-grid">
              <div className="player-detail-item">
                <h3>Name</h3>
                <p>{course.name}</p>
              </div>
              <div className="player-detail-item">
                <h3>Location</h3>
                <p>{course.location || 'Not provided'}</p>
              </div>
              <div className="player-detail-item">
                <h3>Holes</h3>
                <p>{course.holes}</p>
              </div>
              <div className="player-detail-item">
                <h3>Par</h3>
                <p>{course.par}</p>
              </div>
              <div className="player-detail-item">
                <h3>Course Rating</h3>
                <p>{course.rating}</p>
              </div>
              <div className="player-detail-item">
                <h3>Slope Rating</h3>
                <p>{course.slope}</p>
              </div>
              <div className="player-detail-item">
                <h3>Tees</h3>
                <p>{course.tees}</p>
              </div>
              <div className="player-detail-item">
                <h3>Average Score</h3>
                <p>{calculateAverageScore()}</p>
              </div>
            </div>
            
            <div className="player-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="btn-icon-left" />
                Edit Details
              </button>
              <button 
                className="btn btn-destructive"
                onClick={handleDeleteCourse}
              >
                <Trash2 className="btn-icon-left" />
                Delete Course
              </button>
            </div>
          </div>
        </div>

        <div className="player-card">
          <div className="rounds-header">
            <div>
              <h2 className="player-card-title">Rounds History</h2>
              <p className="player-card-description">Recent rounds played at this course</p>
            </div>
            <Link 
              to="/rounds/add" 
              state={{ courseId: course.id }}
              className="btn btn-primary"
            >
              <PlusCircle className="btn-icon-left" />
              Add Round
            </Link>
          </div>
          <div className="player-card-content">
            {courseRounds.length === 0 ? (
              <div className="no-rounds">
                No rounds recorded at this course yet.
              </div>
            ) : (
              <>
                <table className="rounds-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Player</th>
                      <th>Score</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseRounds.slice(0, 5).map((round) => {
                      const player = getPlayerById(round.playerId);
                      return (
                        <tr key={round.id}>
                          <td>{new Date(round.date).toLocaleDateString()}</td>
                          <td>{player?.name || 'Unknown Player'}</td>
                          <td>{round.score}</td>
                          <td>
                            <button 
                              className="delete-button"
                              onClick={() => handleDeleteRound(round.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {courseRounds.length > 5 && (
                  <Link 
                    to="/rounds" 
                    state={{ courseId: course.id }}
                    className="btn btn-outline view-all-button"
                  >
                    View All Rounds
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Course Dialog */}
      {isEditDialogOpen && (
        <div className="add-dialog">
          <div className="dialog-content">
            <div className="dialog-header">
              <h2 className="dialog-title">Edit Course</h2>
              <p className="dialog-description">Update course information.</p>
            </div>
            <form className="dialog-form" onSubmit={handleUpdateCourse}>
              <div className="form-group">
                <label htmlFor="edit-name" className="form-label">Course Name</label>
                <input
                  id="edit-name"
                  className="form-input"
                  value={editedCourse.name}
                  onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-holes" className="form-label">Holes</label>
                  <input
                    id="edit-holes"
                    type="number"
                    className="form-input"
                    value={editedCourse.holes}
                    onChange={(e) => setEditedCourse({ ...editedCourse, holes: parseInt(e.target.value) })}
                    min="9"
                    max="18"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-par" className="form-label">Par</label>
                  <input
                    id="edit-par"
                    type="number"
                    className="form-input"
                    value={editedCourse.par}
                    onChange={(e) => setEditedCourse({ ...editedCourse, par: parseInt(e.target.value) })}
                    min="60"
                    max="80"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-slope" className="form-label">Slope Rating</label>
                  <input
                    id="edit-slope"
                    type="number"
                    className="form-input"
                    value={editedCourse.slope}
                    onChange={(e) => setEditedCourse({ ...editedCourse, slope: parseInt(e.target.value) })}
                    min="55"
                    max="155"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-rating" className="form-label">Course Rating</label>
                  <input
                    id="edit-rating"
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={editedCourse.rating}
                    onChange={(e) => setEditedCourse({ ...editedCourse, rating: parseFloat(e.target.value) })}
                    min="60"
                    max="80"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="edit-tees" className="form-label">Tees</label>
                <input
                  id="edit-tees"
                  className="form-input"
                  value={editedCourse.tees}
                  onChange={(e) => setEditedCourse({ ...editedCourse, tees: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-location" className="form-label">Location (optional)</label>
                <input
                  id="edit-location"
                  className="form-input"
                  value={editedCourse.location}
                  onChange={(e) => setEditedCourse({ ...editedCourse, location: e.target.value })}
                />
              </div>
              <div className="dialog-footer">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;