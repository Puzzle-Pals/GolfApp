import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGolfBall, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function AdminSection() {
  const [players, setPlayers] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [pointSystemEnabled, setPointSystemEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const sortedPlayers = [...storedPlayers].sort((a, b) => a.name.localeCompare(b.name));
    setPlayers(sortedPlayers);
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    setWeeks(storedWeeks);
    const storedPointSystem = localStorage.getItem('pointSystemEnabled');
    if (storedPointSystem === null) {
      localStorage.setItem('pointSystemEnabled', JSON.stringify(false));
      setPointSystemEnabled(false);
    } else {
      setPointSystemEnabled(JSON.parse(storedPointSystem));
    }
  }, []);

  const addPlayer = () => {
    if (!newPlayer.trim()) {
      alert('Please enter a player name.');
      return;
    }
    if (players.some(player => player.name.toLowerCase() === newPlayer.toLowerCase())) {
      alert('Player already exists.');
      return;
    }
    const updatedPlayers = [...players, { name: newPlayer, gamesPlayed: 0, wins: 0, secondPlace: 0, thirdPlace: 0, deucePotWins: 0, closestToPinWins: 0, scores: [] }].sort((a, b) => a.name.localeCompare(b.name));
    setPlayers(updatedPlayers);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    setNewPlayer('');
  };

  const editPlayer = (index) => {
    const newName = prompt('Enter new player name:', players[index].name);
    if (newName && newName.trim() && !players.some((p, i) => i !== index && p.name.toLowerCase() === newName.toLowerCase())) {
      const updatedPlayers = [...players];
      updatedPlayers[index].name = newName;
      setPlayers(updatedPlayers.sort((a, b) => a.name.localeCompare(b.name)));
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
    } else if (newName && newName.trim()) {
      alert('Player name already exists.');
    }
  };

  const deletePlayer = (index) => {
    if (window.confirm(`Are you sure you want to delete ${players[index].name}?`)) {
      const updatedPlayers = players.filter((_, i) => i !== index).sort((a, b) => a.name.localeCompare(b.name));
      setPlayers(updatedPlayers);
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
    }
  };

  const togglePointSystem = () => {
    const newValue = !pointSystemEnabled;
    setPointSystemEnabled(newValue);
    localStorage.setItem('pointSystemEnabled', JSON.stringify(newValue));
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold text-emerald-green flex items-center mb-4">
          <FaGolfBall className="mr-2 text-golden-yellow" /> Admin Section
        </h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Manage Players</h3>
          <div className="flex mb-4">
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              placeholder="Enter player name"
              className="input flex-grow mr-2"
            />
            <button onClick={addPlayer} className="btn btn-primary">
              <FaPlus className="mr-1" /> Add Player
            </button>
          </div>
          {players.length === 0 ? (
            <p className="text-dark-slate">No players added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left">Player</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={player.name} className={index % 2 === 0 ? 'bg-cream-white' : ''}>
                      <td className="flex items-center space-x-2">
                        <span>{player.name}</span>
                        <button
                          onClick={() => editPlayer(index)}
                          className="text-dark-slate hover:text-coral-red-dark"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deletePlayer(index)}
                          className="text-dark-slate hover:text-coral-red-dark"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Settings</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={pointSystemEnabled}
              onChange={togglePointSystem}
              className="mr-2"
            />
            <span className="text-dark-slate">Enable Point System</span>
          </label>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Manage Weeks</h3>
          <button
            onClick={() => navigate('/admin/add-week')}
            className="btn btn-primary mb-4"
          >
            <FaPlus className="mr-1" /> Add Week
          </button>
          {weeks.length === 0 ? (
            <p className="text-dark-slate">No weeks added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left">Week</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {weeks.sort((a, b) => a.weekNumber - b.weekNumber).map(week => (
                    <tr key={week.weekNumber} className={week.weekNumber % 2 === 0 ? 'bg-cream-white' : ''}>
                      <td>Week {week.weekNumber}</td>
                      <td>
                        <button
                          onClick={() => navigate(`/admin/edit-week/${week.weekNumber}`)}
                          className="text-dark-slate hover:text-coral-red-dark mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete Week ${week.weekNumber}?`)) {
                              const updatedWeeks = weeks.filter(w => w.weekNumber !== week.weekNumber);
                              setWeeks(updatedWeeks);
                              localStorage.setItem('weeks', JSON.stringify(updatedWeeks));
                            }
                          }}
                          className="text-dark-slate hover:text-coral-red-dark"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSection;