import { useState, useEffect } from 'react';

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);
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

  // Sort players by total points and return top 10
  const getTopPlayers = () => {
    return [...players]
      .sort((a, b) => {
        // Sort by total points (descending)
        const pointsA = calculateTotalPoints(a);
        const pointsB = calculateTotalPoints(b);
        if (pointsB !== pointsA) {
          return pointsB - pointsA;
        }
        // If tied, sort by first name (alphabetically)
        const firstNameA = a.name.split(' ')[0].toLowerCase();
        const firstNameB = b.name.split(' ')[0].toLowerCase();
        return firstNameA.localeCompare(firstNameB);
      })
      .slice(0, 10); // Take top 10
  };

  // Get top players by total points
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wins</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2nd Place</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closest to Pin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deuce Pot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Points</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableRows.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.wins}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.secondPlace}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.closestToPinWins}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.deucePotWins}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.thirdPlace}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Scoring Legend</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Wins: 5 points</li>
                <li>2nd Place: 4 points</li>
                <li>Closest to Pin: 3 points</li>
                <li>Deuce Pot: 2 points</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;