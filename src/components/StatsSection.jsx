import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StatsSection() {
  const [players, setPlayers] = useState([]);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    setPlayers(storedPlayers);
    setWeeks(storedWeeks);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Player Stats</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Players</h3>
        <ul className="space-y-2">
          {players
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(player => (
              <li key={player.name}>
                <Link
                  to={`/stats/${encodeURIComponent(player.name)}`}
                  className="text-blue-600 hover:underline"
                >
                  {player.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weekly Results</h3>
        {weeks.length === 0 ? (
          <p className="text-gray-600">No weeks recorded.</p>
        ) : (
          <ul className="space-y-2">
            {weeks.map(week => (
              <li key={week.weekNumber}>
                <Link
                  to={`/week/${week.weekNumber}`}
                  className="text-blue-600 hover:underline"
                >
                  Week {week.weekNumber}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StatsSection;