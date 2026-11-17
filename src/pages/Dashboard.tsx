
import { Link } from 'react-router-dom';
import { PlusCircle, Users, Flag, Trophy } from 'lucide-react';
import { useGolfData } from '../context/GolfDataContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { players, courses, rounds, calculateHandicap, loading } = useGolfData();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Find the player with the lowest handicap (best player)
  const getBestPlayer = () => {
    if (players.length === 0) return null;
    
    let bestPlayer = players[0];
    let lowestHandicap = calculateHandicap(bestPlayer.id);
    
    players.forEach(player => {
      const handicap = calculateHandicap(player.id);
      if (handicap > 0 && handicap < lowestHandicap) {
        lowestHandicap = handicap;
        bestPlayer = player;
      }
    });
    
    return { player: bestPlayer, handicap: lowestHandicap };
  };

  const bestPlayer = getBestPlayer();

  // Get recent rounds
  const recentRounds = [...rounds]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/rounds/add" className="btn btn-primary">
          <PlusCircle className="btn-icon-left" />
          Add Round
        </Link>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Players</h3>
            <Users className="stat-card-icon" />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{players.length}</div>
            <p className="stat-description">
              {players.length === 0 ? "No players yet" : `${players.length} registered players`}
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Courses</h3>
            <Flag className="stat-card-icon" />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{courses.length}</div>
            <p className="stat-description">
              {courses.length === 0 ? "No courses yet" : `${courses.length} golf courses`}
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Rounds</h3>
            <Trophy className="stat-card-icon" />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{rounds.length}</div>
            <p className="stat-description">
              {rounds.length === 0 ? "No rounds played yet" : `${rounds.length} rounds played`}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-details">
        <div className="card best-player-card">
          <div className="card-header">
            <h2 className="card-title">Best Player</h2>
            <p className="card-description">Player with the lowest handicap</p>
          </div>
          <div className="card-content">
            {bestPlayer && bestPlayer.handicap > 0 ? (
              <div className="best-player-content">
                <div className="best-player-info">
                  <span className="player-name">{bestPlayer.player.name}</span>
                  <span className="handicap-badge">
                    Handicap: {bestPlayer.handicap}
                  </span>
                </div>
                <Link to={`/players/${bestPlayer.player.id}`} className="btn btn-outline btn-full">
                  View Profile
                </Link>
              </div>
            ) : (
              <div className="empty-message">
                Not enough rounds to calculate handicaps yet.
              </div>
            )}
          </div>
        </div>

        <div className="card recent-rounds-card">
          <div className="card-header">
            <h2 className="card-title">Recent Rounds</h2>
            <p className="card-description">Latest golf rounds recorded</p>
          </div>
          <div className="card-content">
            {recentRounds.length > 0 ? (
              <div className="recent-rounds-list">
                {recentRounds.map(round => {
                  const player = players.find(p => p.id === round.playerId);
                  const course = courses.find(c => c.id === round.courseId);
                  
                  return (
                    <div key={round.id} className="recent-round-item">
                      <div className="round-details">
                        <span className="player-name">{player?.name}</span>
                        <span className="at-text"> at </span>
                        <span className="course-name">{course?.name}</span>
                      </div>
                      <div className="round-score">
                        <span className="round-date">{new Date(round.date).toLocaleDateString()}</span>
                        <span className="score-value">{round.score}</span>
                      </div>
                    </div>
                  );
                })}
                <Link to="/rounds" className="btn btn-outline btn-full">
                  View All Rounds
                </Link>
              </div>
            ) : (
              <div className="empty-message">
                No rounds recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;