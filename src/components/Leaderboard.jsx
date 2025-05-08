import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGolfBall } from 'react-icons/fa';

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [pointsSystemEnabled, setPointsSystemEnabled] = useState(false);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const pointsEnabled = JSON.parse(localStorage.getItem('pointsSystemEnabled') || 'false');
    setPlayers(storedPlayers);
    setPointsSystemEnabled(pointsEnabled);
  }, []);

  const getTopPlayers = (key, label) => {
    return [...players]
      .sort((a, b) => {
        const valueA = a[key] || 0;
        const valueB = b[key] || 0;
        if (valueB === valueA) {
          return a.name.localeCompare(b.name);
        }
        return valueB - valueA;
      })
      .slice(0, 5)
      .map((player, index) => ({
        rank: index + 1,
        name: player.name,
        value: player[key] || 0
      }));
  };

  const renderLeaderboard = (title, key, label) => {
    const topPlayers = getTopPlayers(key, label);
    return (
      <div className="leaderboard-card">
        <h3 className="text-lg font-semibold text-dark-slate mb-2">{title}</h3>
        {topPlayers.length === 0 ? (
          <p className="text-dark-slate">No data available</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left">Rank</th>
                <th className="text-left">Player</th>
                <th className="text-left">{label}</th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.map((player) => (
                <tr key={player.name} className={player.rank % 2 === 0 ? 'bg-cream-white' : ''}>
                  <td>{player.rank}</td>
                  <td>
                    <Link
                      to={`/player/${encodeURIComponent(player.name)}`}
                      className="text-sky-blue hover:text-coral-red"
                    >
                      {player.name}
                    </Link>
                  </td>
                  <td>{player.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold text-emerald-green flex items-center mb-4">
          <FaGolfBall className="mr-2 text-golden-yellow" /> Leaderboards
        </h2>
        <div className={`leaderboard-grid ${pointsSystemEnabled ? 'points-enabled' : ''}`}>
          {renderLeaderboard('Wins', 'wins', 'Wins')}
          {renderLeaderboard('2nd Place', 'secondPlace', '2nd Place')}
          {renderLeaderboard('Highest Score', 'thirdPlace', 'Highest Score')}
          {renderLeaderboard('Deuce Pot Wins', 'deucePotWins', 'Deuce Pot Wins')}
          {renderLeaderboard('Closest to Pin', 'closestToPinWins', 'Closest to Pin')}
          {pointsSystemEnabled && renderLeaderboard('Points', 'points', 'Points')}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;