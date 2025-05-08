import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGolfBall } from 'react-icons/fa';

function StatsSection() {
  const [players, setPlayers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'gamesPlayed', direction: 'descending' });

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const sortedPlayers = [...storedPlayers].sort((a, b) => {
      const firstNameA = a.name.split(' ')[0].toLowerCase();
      const firstNameB = b.name.split(' ')[0].toLowerCase();
      return firstNameA.localeCompare(firstNameB);
    });
    setPlayers(sortedPlayers);
  }, []);

  const getAverageScore = (scores) => {
    if (!scores || scores.length === 0) return '-';
    const validScores = scores.filter(score => typeof score === 'number' && !isNaN(score));
    if (validScores.length === 0) return '-';
    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    return average.toFixed(1);
  };

  const sortPlayers = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedPlayers = [...players].sort((a, b) => {
      if (key === 'averageScore') {
        const valueA = parseFloat(getAverageScore(a.scores)) || 0;
        const valueB = parseFloat(getAverageScore(b.scores)) || 0;
        return direction === 'ascending' ? valueA - valueB : valueB - valueA;
      }
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
          <FaGolfBall className="mr-2 text-golden-yellow" /> Player Stats
        </h2>
        {players.length === 0 ? (
          <p className="text-dark-slate">No players added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-center">Name</th>
                  <th className="text-center">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); sortPlayers('gamesPlayed'); }}
                      className="text-dark-slate hover:text-coral-red-dark"
                    >
                      Games Played{getSortIndicator('gamesPlayed')}
                    </a>
                  </th>
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
                  <th className="text-center">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); sortPlayers('averageScore'); }}
                      className="text-dark-slate hover:text-coral-red-dark"
                    >
                      Average Score{getSortIndicator('averageScore')}
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.name} className={index % 2 === 0 ? 'bg-cream-white' : ''}>
                    <td className="text-center">
                      <Link
                        to={`/stats/${encodeURIComponent(player.name)}`}
                        className="text-dark-slate hover:text-coral-red-dark"
                      >
                        {player.name}
                      </Link>
                    </td>
                    <td className="text-center">{player.gamesPlayed || 0}</td>
                    <td className="text-center">{player.wins || 0}</td>
                    <td className="text-center">{player.secondPlace || 0}</td>
                    <td className="text-center">{player.thirdPlace || 0}</td>
                    <td className="text-center">{player.deucePotWins || 0}</td>
                    <td className="text-center">{player.closestToPinWins || 0}</td>
                    <td className="text-center">{getAverageScore(player.scores)}</td>
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

export default StatsSection;