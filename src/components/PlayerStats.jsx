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

  if (!player) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-600">Player not found.</p>
        <Link to="/stats" className="text-blue-600 hover:underline">Back to Stats</Link>
      </div>
    );
  }

  // Filter weeks where player participated
  const playerWeeks = weeks.filter(week =>
    week.teams.some(team => team.player1 === player.name || team.player2 === player.name)
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{player.name}’s Stats</h2>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Season Stats</h3>
          <p><strong>Games Played:</strong> {player.gamesPlayed}</p>
          <p><strong>Wins:</strong> {player.wins}</p>
          <p><strong>Second Place:</strong> {player.secondPlace}</p>
          <p><strong>Highest Score:</strong> {player.thirdPlace}</p>
          <p><strong>Deuce Pot:</strong> {player.deucePotWins}</p>
          <p><strong>Closest to Pin:</strong> {player.closestToPinWins}</p>
          <p><strong>Average Score (season):</strong> {player.scores.length > 0 ? (player.scores.reduce((a, b) => a + b, 0) / player.scores.length).toFixed(1) : 'N/A'}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Weekly Results</h3>
          {playerWeeks.length === 0 ? (
            <p className="text-gray-600">No weeks recorded for this player.</p>
          ) : (
            <ul className="space-y-2">
              {playerWeeks.map(week => {
                const team = week.teams.find(t => t.player1 === player.name || t.player2 === player.name);
                return (
                  <li key={week.weekNumber}>
                    <Link
                      to={`/stats/${encodeURIComponent(player.name)}/week/${week.weekNumber}`}
                      className="text-blue-600 hover:underline"
                    >
                      Week {week.weekNumber}: {team.placement === 'winner' ? 'Winners' : team.placement === 'secondPlace' ? '2nd place' : 'Highest score'} - {team.player1} & {team.player2}: {team.score}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <Link to="/stats" className="mt-4 inline-block text-blue-600 hover:underline">Back to Stats</Link>
    </div>
  );
}

export default PlayerStats;