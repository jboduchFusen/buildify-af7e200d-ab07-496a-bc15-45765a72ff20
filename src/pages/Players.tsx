
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGolfData, Player } from '../context/GolfDataContext';
import { PlusCircle, MoreHorizontal, Search, User, Edit, Trash2, GolfClub } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/players.css';

const Players = () => {
  const { players, addPlayer, deletePlayer, calculateHandicap, loading } = useGolfData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', email: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.name.trim()) {
      addPlayer({
        name: newPlayer.name.trim(),
        email: newPlayer.email.trim() || undefined,
      });
      setNewPlayer({ name: '', email: '' });
      setIsAddDialogOpen(false);
    }
  };

  const toggleDropdown = (playerId: string) => {
    setActiveDropdown(activeDropdown === playerId ? null : playerId);
  };

  const handleDeletePlayer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this player? All associated rounds will also be deleted.')) {
      deletePlayer(id);
      setActiveDropdown(null);
    }
  };

  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (player.email && player.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="players-container">
      <div className="players-header">
        <h1 className="players-title">Players</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle className="btn-icon-left" />
          Add Player
        </button>
      </div>

      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {players.length === 0 ? (
        <div className="empty-players">
          <div className="empty-icon-container">
            <User className="empty-icon" />
          </div>
          <h2 className="empty-title">No players yet</h2>
          <p className="empty-description">
            You haven't added any players yet. Add your first player to start tracking golf stats.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="btn-icon-left" />
            Add Player
          </button>
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="no-results">
          <p>No players found matching your search.</p>
        </div>
      ) : (
        <table className="players-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Handicap</th>
              <th>Rounds</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map(player => {
              const { getPlayerRounds } = useGolfData();
              const playerRounds = getPlayerRounds(player.id);
              const handicap = calculateHandicap(player.id);
              
              return (
                <tr key={player.id}>
                  <td>
                    <Link to={`/players/${player.id}`} className="player-name-link">
                      {player.name}
                    </Link>
                  </td>
                  <td>{player.email || '-'}</td>
                  <td>{handicap > 0 ? handicap : 'N/A'}</td>
                  <td>{playerRounds.length}</td>
                  <td className="player-actions">
                    <div className="dropdown">
                      <button 
                        className="dropdown-button"
                        onClick={() => toggleDropdown(player.id)}
                      >
                        <MoreHorizontal />
                      </button>
                      {activeDropdown === player.id && (
                        <div className="dropdown-menu">
                          <div className="dropdown-label">Actions</div>
                          <div className="dropdown-separator"></div>
                          <Link 
                            to={`/players/${player.id}`} 
                            className="dropdown-item"
                            onClick={() => setActiveDropdown(null)}
                          >
                            View details
                          </Link>
                          <Link 
                            to={`/rounds/add`} 
                            state={{ playerId: player.id }}
                            className="dropdown-item"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <GolfClub className="dropdown-icon" />
                            Add round
                          </Link>
                          <div className="dropdown-separator"></div>
                          <button 
                            className="dropdown-item destructive"
                            onClick={() => handleDeletePlayer(player.id)}
                          >
                            <Trash2 className="dropdown-icon" />
                            Delete player
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

      {/* Add Player Dialog */}
      {isAddDialogOpen && (
        <div className="add-dialog">
          <div className="dialog-content">
            <div className="dialog-header">
              <h2 className="dialog-title">Add New Player</h2>
              <p className="dialog-description">Enter the details for the new player.</p>
            </div>
            <form className="dialog-form" onSubmit={handleAddPlayer}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  id="name"
                  className="form-input"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email (optional)</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={newPlayer.email}
                  onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="dialog-footer">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;