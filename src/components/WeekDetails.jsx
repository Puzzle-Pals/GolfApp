import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function WeekDetails() {
  const { weekNumber } = useParams();
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
        <Link to="/stats" className="text-blue-600 hover:underline">Back to Player Stats</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Week {weekNumber} Results</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="font-medium">Week {week.weekNumber}</p>
        {week.teams.map((team, index) => (
          <p key={index}>
            {team.placement === 'winner' ? 'Winners' :
             team.placement === 'secondPlace' ? '2nd place' :
             'Highest score'} - {team.player1} & {team.player2}: {team.score}
          </p>
        ))}
        {week.deucePotWinner && (
          <p>Deuce Pot: {week.deucePotWinner}</p>
        )}
        {week.closestToPinWinner && (
          <p>Closest to Pin: {week.closestToPinWinner}</p>
        )}
      </div>
      <Link to="/stats" className="mt-4 inline-block text-blue-600 hover:underline">Back to Player Stats</Link>
    </div>
  );
}

export default WeekDetails;