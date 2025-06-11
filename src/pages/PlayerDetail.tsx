
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGolfData } from '../context/GolfDataContext';
import { ChevronLeft, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/player-detail.css';

const PlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getPlayerById, 
    getPlayerRounds, 
    getCourseById, 
    updatePlayer, 
    deletePlayer,
    calculateHandicap,
    deleteRound,
    loading
  } = useGolfData();

  if (loading) {
    return <LoadingSpinner />;
  }

  const player = getPlayerById(id || '');
  
  if (!player) {
    return (
      <div className="not-found">
        <h2>Player Not Found</h2>
        <p>The player you're looking for doesn't exist or has been deleted.</p>
        <Link to="/players" className="btn btn-primary">
          <ChevronLeft className="btn-icon-left" />
          Back to Players
        </Link>
      </div>
    );
  }

  const playerRounds = getPlayerRounds(player.id).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handicap = calculateHandicap(player.id);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState({
    name: player.name,
    email: player.email || '',
  });

  const handleUpdatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedPlayer.name.trim()) {
      updatePlayer(player.id, {
        name: editedPlayer.name.trim(),
        email: editedPlayer.email.trim() || undefined,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeletePlayer = () => {
    if (window.confirm(`Are you sure you want to delete ${player.name}? All associated rounds will also be deleted.`)) {
      deletePlayer(player.id);
      navigate('/players');
    }
  };

  const handleDeleteRound = (roundId: string) => {
    if (window.confirm('Are you sure you want to delete this round?')) {
      deleteRound(roundId);
    }
  };

  return (
    <div className="player-detail-container">
      <div className="player-detail-header">
        <Link to="/players" className="btn btn-outline back-button">
          <ChevronLeft className="btn-icon-left" />
          Back
        </Link>
        <h1 className="player-name">{player.name}</h1>
      </div>

      <div className="player-cards">
        <div className="player-card">
          <div className="player-card-header">
            <h2 className="player-card-title">Player Details</h2>
            <p className="player-card-description">View and manage player information</p>
          </div>
          <div className="player-card-content">
            <div className="player-details-grid">
              <div className="player-detail-item">
                <h3>Name</h3>
                <p>{player.name}</p>
              </div>
              <div className="player-detail-item">
                <h3>Email</h3>
                <p>{player.email || 'Not provided'}</p>
              </div>
              <div className="player-detail-item">
                <h3>Handicap</h3>
                <p>{handicap > 0 ? handicap : 'Not enough rounds'}</p>
              </div>
              <div className="player-detail-item">
                <h3>Total Rounds</h3>
                <p>{playerRounds.length}</p>
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
                onClick={handleDeletePlayer}
              >
                <Trash2 className="btn-icon-left" />
                Delete Player
              </button>
            </div>
          </div>
        </div>

        <div className="player-card">
          <div className="rounds-header">
            <div>
              <h2 className="player-card-title">Rounds History</h2>
              <p className="player-card-description">Recent golf rounds played</p>
            </div>
            <Link 
              to="/rounds/add" 
              state={{ playerId: player.id }}
              className="btn btn-primary"
            >
              <PlusCircle className="btn-icon-left" />
              Add Round
            </Link>
          </div>
          <div className="player-card-content">
            {playerRounds.length === 0 ? (
              <div className="no-rounds">
                No rounds recorded yet.
              </div>
            ) : (
              <>
                <table className="rounds-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Course</th>
                      <th>Score</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerRounds.slice(0, 5).map((round) => {
                      const course = getCourseById(round.courseId);
                      return (
                        <tr key={round.id}>
                          <td>{new Date(round.date).toLocaleDateString()}</td>
                          <td>{course?.name || 'Unknown Course'}</td>
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
                {playerRounds.length > 5 && (
                  <Link 
                    to="/rounds" 
                    state={{ playerId: player.id }}
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

      {/* Edit Player Dialog */}
      {isEditDialogOpen && (
        <div className="add-dialog">
          <div className="dialog-content">
            <div className="dialog-header">
              <h2 className="dialog-title">Edit Player</h2>
              <p className="dialog-description">Update player information.</p>
            </div>
            <form className="dialog-form" onSubmit={handleUpdatePlayer}>
              <div className="form-group">
                <label htmlFor="edit-name" className="form-label">Name</label>
                <input
                  id="edit-name"
                  className="form-input"
                  value={editedPlayer.name}
                  onChange={(e) => setEditedPlayer({ ...editedPlayer, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-email" className="form-label">Email (optional)</label>
                <input
                  id="edit-email"
                  type="email"
                  className="form-input"
                  value={editedPlayer.email}
                  onChange={(e) => setEditedPlayer({ ...editedPlayer, email: e.target.value })}
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

export default PlayerDetail;