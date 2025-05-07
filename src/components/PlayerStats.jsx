import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function PlayerStats() {
  const { playerName } = useParams();
  const [player, setPlayer] = useState(null);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    const foundPlayer = storedPlayers.find(p => p.name === decodeURIComponent(playerName));
    setPlayer(foundPlayer);
    setWeeks(storedWeeks);
  }, [playerName]);

  // Convert score to relative-to-par format (assuming par 37)
  const formatScore = (score) => {
    const par = 37;
    const relativeScore = score - par;
    if (relativeScore > 0) return `+${relativeScore}`;
    if (relativeScore === 0) return '0';
    return relativeScore.toString();
  };

  // Get weeks where the player participated
  const playerWeeks = weeks
    .filter(week => 
      week.teams.some(team => team.player1 === player?.name || team.player2 === player?.name) ||
      week.deucePotWinner === player?.name ||
      week.closestToPinWinner === player?.name
    )
    .sort((a, b) => a.weekNumber - b.weekNumber);

  // Format week details
  const formatWeekDetails = (week) => {
    const team = week.teams.find(t => t.player1 === player?.name || t.player2 === player?.name);
    let result = `Week ${week.weekNumber}: `;
    if (team) {
      const partner = team.player1 === player?.name ? team.player2 : team.player1;
      result += `${team.placement === 'winner' ? 'Won' : team.placement === 'secondPlace' ? '2nd Place' : 'Highest Score'} with ${partner} (Score: ${formatScore(team.score)})`;
    }
    if (week.deucePotWinner === player?.name) {
      result += `${team ? ', ' : ''}Won Deuce Pot`;
    }
    if (week.closestToPinWinner === player?.name) {
      result += `${team || week.deucePotWinner === player?.name ? ', ' : ''}Won Closest to Pin`;
    }
    return result;
  };

  if (!player) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Player Not Found</h2>
        <p className="text-gray-600">The player you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{player.name}'s Stats</h2>
      
      {/* Player Stats Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Player Stats</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Games Played</td>
              <td className="px-6 py-4 whitespace-nowrap">{player.gamesPlayed}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Wins</td>
              <td className="px-6 py-4 whitespace-nowrap">{player.wins}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">2nd Place</td>
              <td className="px-6 py-4 whitespace-nowrap">{player.secondPlace}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Highest Score</td>
              <td className="px-6 py-4 whitespace-nowrap">{player.thirdPlace}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Deuce Pot Wins</td>
              <td className="px-6 py-4 whitespace-nowrap">{player.deucePotWins}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Closest to Pin Wins</td>
              <td className="px-6 py-4 whitespace-nowrap">{player.closestToPinWins}</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Average Score</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {player.scores.length > 0
                  ? (player.scores.reduce((a, b) => a + b, 0) / player.scores.length).toFixed(2)
                  : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Weekly Results Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weekly Results</h3>
        {playerWeeks.length === 0 ? (
          <p className="text-gray-600">No weeks recorded for this player.</p>
        ) : (
          <ul className="space-y-2">
            {playerWeeks.map(week => (
              <li key={week.weekNumber}>
                <Link
                  to={`/week/${week.weekNumber}`}
                  className="text-blue-600 hover:underline"
                >
                  {formatWeekDetails(week)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PlayerStats;