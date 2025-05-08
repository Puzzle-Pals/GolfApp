import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGolfBall } from 'react-icons/fa';

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'wins', direction: 'descending' });
  const [pointSystemEnabled, setPointSystemEnabled] = useState(false);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedPointSystem = localStorage.getItem('pointSystemEnabled');
    const isPointSystemEnabled = storedPointSystem !== null ? JSON.parse(storedPointSystem) : false;
    setPointSystemEnabled(isPointSystemEnabled);

    const playersWithPoints = storedPlayers.map(player => ({
      ...player,
      points: isPointSystemEnabled
        ? (player.wins || 0) * 10 + 
          (player.secondPlace || 0) * 5 + 
          (player.thirdPlace || 0) * 2 + 
          (player.deucePotWins || 0) * 3 + 
          (player.closestToPinWins || 0) * 3
        : 0
    }));

    setPlayers(playersWithPoints);
  }, []);

  const sortPlayers = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedPlayers = [...players].sort((a, b) => {
      const valueA = a[key] || 0;
      const valueB = b[key] || 0;
      return direction === 'ascending' ? valueA - valueB : valueB - valueA;
    });

    setPlayers(sortedPlayers);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold text-emerald-green flex items-center mb-4">
          <FaGolfBall className="mr-2 text-golden-yellow" /> Leaderboard
        </h2>
        {players.length === 0 ? (
          <p className="text-dark-slate">No players added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-center">Name</th>
                  {pointSystemEnabled && (
                    <th className="text-center">
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); sortPlayers('points'); }}
                        className="text-dark-slate hover:text-coral-red-dark"
                      >
                        Points{getSortIndicator('points')}
                      </a>
                    </th>
                  )}
                  <th className="text-center">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); sortPlayers('wins'); }}
                      className="text-dark-slate hover:text-coral-red-dark"
                    >
                      Wins{getSortIndicator('wins')}
                    </a>
                  </th>
                  <th className="text-center">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); sortPlayers('secondPlace'); }}
                      className="text-dark-slate hover:text-coral-red-dark"
                    >
                      2nd Place{getSortIndicator('secondPlace')}
                    </a>
                  </th>
                  <th className="text-center">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); sortPlayers('thirdPlace'); }}
                      className="text-dark-slate hover:text-coral-red-dark"
                    >
                      Highest Score{getSortIndicator('thirdPlace')}
                    </a>
                  </th>
                  <th className="text-center">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); sortPlayers('deucePotWins'); }}
                      className="text-dark-slate hover:text-coral-red-dark"
                    >
                      Deuce Pot Wins{getSortIndicator('deucePotWins')}
                    </a>
                  </th>
                  <th className="text-center">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); sortPlayers('closestToPinWins'); }}
                      className="text-dark-slate hover:text-coral-red-dark"
                    >
                      Closest to Pin{getSortIndicator('closestToPinWins')}
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.name} className={index % 2 === 0 ? 'bg-cream-white' : ''}>
                    <td>
                      <Link
                        to={`/stats/${encodeURIComponent(player.name)}`}
                        className="text-dark-slate hover:text-coral-red-dark"
                      >
                        {player.name}
                      </Link>
                    </td>
                    {pointSystemEnabled && (
                      <td>{player.points}</td>
                    )}
                    <td>{player.wins || 0}</td>
                    <td>{player.secondPlace || 0}</td>
                    <td>{player.thirdPlace || 0}</td>
                    <td>{player.deucePotWins || 0}</td>
                    <td>{player.closestToPinWins || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;