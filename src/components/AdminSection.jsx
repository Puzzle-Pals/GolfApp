import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGolfBall, FaUserPlus, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function AdminSection() {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [weeks, setWeeks] = useState([]);
  const [pointsSystemEnabled, setPointsSystemEnabled] = useState(false);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    const pointsEnabled = JSON.parse(localStorage.getItem('pointsSystemEnabled') || 'false');
    setPlayers(storedPlayers);
    setWeeks(storedWeeks);
    setPointsSystemEnabled(pointsEnabled);
  }, []);

  const addPlayer = () => {
    if (!newPlayer.trim()) return;
    if (players.some(player => player.name.toLowerCase() === newPlayer.toLowerCase())) {
      alert('Player already exists.');
      return;
    }

    const updatedPlayers = [...players, { name: newPlayer.trim(), gamesPlayed: 0, wins: 0, secondPlace: 0, thirdPlace: 0, deucePotWins: 0, closestToPinWins: 0, scores: [], points: 0 }];
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    setPlayers(updatedPlayers);
    setNewPlayer('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const deleteWeek = (weekNumber) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Week ${weekNumber}?`);
    if (!confirmDelete) return;

    const updatedWeeks = weeks.filter(week => week.weekNumber !== weekNumber);
    localStorage.setItem('weeks', JSON.stringify(updatedWeeks));
    setWeeks(updatedWeeks);

    const updatedPlayers = players.map(player => {
      let gamesPlayed = player.gamesPlayed || 0;
      let wins = player.wins || 0;
      let secondPlaceCount = player.secondPlace || 0;
      let thirdPlaceCount = player.thirdPlace || 0;
      let deucePotWins = player.deucePotWins || 0;
      let closestToPinWins = player.closestToPinWins || 0;
      let scores = player.scores || [];
      let points = player.points || 0;

      const week = weeks.find(w => w.weekNumber === weekNumber);
      if (week) {
        if (week.winners.includes(player.name)) {
          gamesPlayed -= 1;
          wins -= 1;
          scores.pop();
          points -= 3;
        } else if (week.secondPlace.includes(player.name)) {
          gamesPlayed -= 1;
          secondPlaceCount -= 1;
          scores.pop();
          points -= 2;
        } else if (week.thirdPlace.includes(player.name)) {
          gamesPlayed -= 1;
          thirdPlaceCount -= 1;
          scores.pop();
          points -= 1;
        }
        if (week.deucePotWinner === player.name) {
          deucePotWins -= 1;
        }
        if (week.closestToPinWinner === player.name) {
          closestToPinWins -= 1;
        }
      }

      return { ...player, gamesPlayed, wins, secondPlace: secondPlaceCount, thirdPlace: thirdPlaceCount, deucePotWins, closestToPinWins, scores, points };
    });

    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    setPlayers(updatedPlayers);
  };

  const togglePointsSystem = () => {
    const newState = !pointsSystemEnabled;
    setPointsSystemEnabled(newState);
    localStorage.setItem('pointsSystemEnabled', JSON.stringify(newState));

    if (newState) {
      const updatedPlayers = players.map(player => ({
        ...player,
        points: (player.wins * 3) + (player.secondPlace * 2) + (player.thirdPlace || 0)
      }));
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
      setPlayers(updatedPlayers);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold text-emerald-green flex items-center mb-4">
          <FaGolfBall className="mr-2 text-golden-yellow" /> Admin Section
        </h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Add Player</h3>
          <div className="form-row">
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter player name"
              className="input"
            />
            <button onClick={addPlayer} className="btn btn-primary">
              <FaUserPlus className="mr-1" /> Add Player
            </button>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Points System</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={pointsSystemEnabled}
              onChange={togglePointsSystem}
              className="mr-2"
            />
            <span className="text-dark-slate">Enable Points System (3 for Win, 2 for 2nd, 1 for Highest Score)</span>
          </label>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Manage Weeks</h3>
          <Link to="/admin/add-week" className="btn btn-primary mb-2">
            <FaPlus className="mr-1" /> Add Week
          </Link>
          {weeks.length === 0 ? (
            <p className="text-dark-slate">No weeks added yet.</p>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Week</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map(week => (
                  <tr key={week.weekNumber} className={week.weekNumber % 2 === 0 ? 'bg-cream-white' : ''}>
                    <td>Week {week.weekNumber}</td>
                    <td>
                      <Link to={`/admin/edit-week/${week.weekNumber}`} className="text-sky-blue hover:text-coral-red mr-4">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteWeek(week.weekNumber)}
                        className="text-coral-red-dark hover:text-coral-red"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSection;