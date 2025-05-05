import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function WeekStats() {
  const { playerName, weekNumber } = useParams();
  const [week, setWeek] = useState(null);

  useEffect(() => {
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    const foundWeek = storedWeeks.find(w => w.weekNumber === parseInt(weekNumber));
    setWeek(foundWeek);
  }, [weekNumber]);

  if (!week) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-600">Week not found.</p>
        <Link to={`/stats/${encodeURIComponent(playerName)}`} className="text-blue-600 hover:underline">Back to Player Stats</Link>
      </div>
    );
  }

  const team = week.teams.find(t => t.player1 === decodeURIComponent(playerName) || t.player2 === decodeURIComponent(playerName));
  if (!team) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-600">Player not found in this week.</p>
        <Link to={`/stats/${encodeURIComponent(playerName)}`} className="text-blue-600 hover:underline">Back to Player Stats</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{decodeURIComponent(playerName)} - Week {weekNumber} Results</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>
          <strong>Result:</strong> {team.placement === 'winner' ? 'Winners' : team.placement === 'secondPlace' ? '2nd place' : 'Highest score'} - {team.player1} & {team.player2}: {team.score}
        </p>
        {week.deucePotWinner === decodeURIComponent(playerName) && (
          <p><strong>Deuce Pot:</strong> {week.deucePotWinner}</p>
        )}
        {week.closestToPinWinner === decodeURIComponent(playerName) && (
          <p><strong>Closest to Pin:</strong> {week.closestToPinWinner}</p>
        )}
      </div>
      <Link to={`/stats/${encodeURIComponent(playerName)}`} className="mt-4 inline-block text-blue-600 hover:underline">Back to Player Stats</Link>
    </div>
  );
}

export default WeekStats;