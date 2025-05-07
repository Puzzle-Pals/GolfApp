import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StatsSection() {
  const [players, setPlayers] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [pointSystemEnabled, setPointSystemEnabled] = useState(true);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    const storedPointSystem = localStorage.getItem('pointSystemEnabled');
    setPlayers(storedPlayers);
    setWeeks(storedWeeks);
    setPointSystemEnabled(storedPointSystem !== null ? JSON.parse(storedPointSystem) : true);
  }, []);

  // Calculate total points for a player
  const calculateTotalPoints = (player) => {
    return (
      player.wins * 5 +
      player.secondPlace * 4 +
      player.deucePotWins * 2 +
      player.closestToPinWins * 3
    );
  };

  // Sort players by total points or wins, then by first name
  const sortedPlayers = [...players].sort((a, b) => {
    if (pointSystemEnabled) {
      const pointsA = calculateTotalPoints(a);
      const pointsB = calculateTotalPoints(b);
      if (pointsB !== pointsA) {
        return pointsB - pointsA;
      }
    } else {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
    }
    const firstNameA = a.name.split(' ')[0].toLowerCase();
    const firstNameB = b.name.split(' ')[0].toLowerCase();
    return firstNameA.localeCompare(firstNameB);
  });

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Player Stats</h2>

      {/* Weekly Results Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Results</h3>
        {weeks.length === 0 ? (
          <p className="text-gray-600">No weeks recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {weeks
              .sort((a, b) => a.weekNumber - b.weekNumber)
              .map(week => (
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

      {/* Player Stats Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Player Stats</h3>
        {players.length === 0 ? (
          <p className="text-gray-600">No players added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Games Played
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wins
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    2nd Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Highest Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deuce Pot Wins
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Closest to Pin Wins
                  </th>
                  {pointSystemEnabled && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Points
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedPlayers.map(player => (
                  <tr key={player.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/stats/${encodeURIComponent(player.name)}`}
                        className="text-blue-600 hover:underline"
                      >
                        {player.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{player.gamesPlayed}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{player.wins}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{player.secondPlace}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{player.thirdPlace}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{player.deucePotWins}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{player.closestToPinWins}</td>
                    {pointSystemEnabled && (
                      <td className="px-6 py-4 whitespace-nowrap">{calculateTotalPoints(player)}</td>
                    )}
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