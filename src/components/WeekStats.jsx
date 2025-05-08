import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGolfBall } from 'react-icons/fa';

function WeekStats() {
  const { weekNumber } = useParams();
  const [week, setWeek] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const weeks = JSON.parse(localStorage.getItem('weeks') || '[]');
      const foundWeek = weeks.find(w => w.weekNumber === parseInt(weekNumber));
      if (foundWeek) {
        setWeek(foundWeek);
        setError('');
      } else {
        setError('Week not found.');
      }
    } catch (e) {
      console.error('Error fetching week data:', e);
      setError('Failed to load week data.');
    }
  }, [weekNumber]);

  if (error) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-emerald-green">{error}</h2>
        </div>
      </div>
    );
  }

  if (!week) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-emerald-green">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-emerald-green flex items-center">
            <FaGolfBall className="mr-2 text-golden-yellow" /> Week {week.weekNumber} Results
          </h2>
          <Link
            to="/weekly-results"
            className="text-sky-blue hover:text-coral-red text-sm font-semibold"
          >
            Back to Weekly Results
          </Link>
        </div>
        <div className="space-y-4">
          {week.teams && week.teams.length > 0 ? (
            week.teams.map((team, index) => (
              <div key={index} className="border-b border-cream-white pb-2">
                <h3 className="text-lg font-semibold text-dark-slate">
                  {team.placement === 'winner' ? 'Winners' : 
                   team.placement === 'secondPlace' ? '2nd Place' : 'Highest Score'}
                </h3>
                <p className="text-dark-slate">
                  {team.player1 && team.player2 
                    ? `${team.player1} & ${team.player2}: ${team.score}`
                    : 'Team data unavailable'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-dark-slate">No team data available for this week.</p>
          )}
          {(week.deucePotWinner || week.closestToPinWinner) && (
            <div className="border-b border-cream-white pb-2">
              <h3 className="text-lg font-semibold text-dark-slate">Individual Awards</h3>
              <div className="flex flex-row space-x-4">
                {week.deucePotWinner && (
                  <p className="text-dark-slate">
                    <strong>Deuce Pot Winner:</strong> {week.deucePotWinner}
                  </p>
                )}
                {week.closestToPinWinner && (
                  <p className="text-dark-slate">
                    <strong>Closest to Pin Winner:</strong> {week.closestToPinWinner}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeekStats;