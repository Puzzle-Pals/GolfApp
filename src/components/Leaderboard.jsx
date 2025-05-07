import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [pointSystemEnabled, setPointSystemEnabled] = useState(true);
  const [sortKey, setSortKey] = useState(null); // Track current sort key

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedPointSystem = localStorage.getItem('pointSystemEnabled');
    setPlayers(storedPlayers);
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

  // Sort players by selected key or default (total points or wins)
  const getTopPlayers = () => {
    return [...players]
      .sort((a, b) => {
        // Handle sorting based on sortKey or default
        if (sortKey) {
          // Sort by selected stat (descending)
          const valueA = a[sortKey];
          const valueB = b[sortKey];
          if (valueB !== valueA) {
            return valueB - valueA;
          }
        } else if (pointSystemEnabled) {
          // Default: Sort by total points (descending)
          const pointsA = calculateTotalPoints(a);
          const pointsB = calculateTotalPoints(b);
          if (pointsB !== pointsA) {
            return pointsB - pointsA;
          }
        } else {
          // Default: Sort by wins (descending)
          if (b.wins !== a.wins) {
            return b.wins - a.wins;
          }
        }
        // If tied, sort by first name (alphabetically)
        const firstNameA = a.name.split(' ')[0].toLowerCase();
        const firstNameB = b.name.split(' ')[0].toLowerCase();
        return firstNameA.localeCompare(firstNameB);
      })
      .slice(0, 10); // Take top 10
  };

  // Handle sort button click
  const handleSort = (key) => {
    setSortKey(key);
  };

  // Get top players
  const topPlayers = getTopPlayers();

  // Create rows for the table (max 10 rows)
  const tableRows = topPlayers.map(player => ({
    name: player.name,
    wins: player.wins,
    secondPlace: player.secondPlace,
    thirdPlace: player.thirdPlace,
    deucePotWins: player.deucePotWins,
    closestToPinWins: player.closestToPinWins,
    totalPoints: calculateTotalPoints(player)
  }));

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Leaderboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {players.length === 0 ? (
          <p className="text-gray-600">No players added yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleSort('wins')}
                          className="mb-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-700"
                        >
                          Sort by
                        </button>
                        Wins
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleSort('secondPlace')}
                          className="mb-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-700"
                        >
                          Sort by
                        </button>
                        2nd Place
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleSort('closestToPinWins')}
                          className="mb-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-700"
                        >
                          Sort by
                        </button>
                        Closest to Pin
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleSort('deucePotWins')}
                          className="mb-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-700"
                        >
                          Sort by
                        </button>
                        Deuce Pot
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleSort('thirdPlace')}
                          className="mb-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-700"
                        >
                          Sort by
                        </button>
                        Highest Score
                      </div>
                    </th>
                    {pointSystemEnabled && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Points
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableRows.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/stats/${encodeURIComponent(row.name)}`}
                          className="text-blue-600 hover:underline"
                        >
                          {row.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.wins}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.secondPlace}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.closestToPinWins}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.deucePotWins}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.thirdPlace}</td>
                      {pointSystemEnabled && (
                        <td className="px-6 py-4 whitespace-nowrap">{row.totalPoints}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pointSystemEnabled && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Scoring Legend</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Wins: 5 points</li>
                  <li>2nd Place: 4 points</li>
                  <li>Closest to Pin: 3 points</li>
                  <li>Deuce Pot: 2 points</li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;