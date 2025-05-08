import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaGolfBall } from 'react-icons/fa';

function WeekStats() {
  const { weekNumber } = useParams();
  const [weekData, setWeekData] = useState(null);

  useEffect(() => {
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    const week = storedWeeks.find(w => w.weekNumber === parseInt(weekNumber));
    setWeekData(week);
  }, [weekNumber]);

  if (!weekData) {
    return (
      <div className="container">
        <div className="card">
          <p className="text-dark-slate">No data available for Week {weekNumber}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold text-emerald-green flex items-center mb-4">
          <FaGolfBall className="mr-2 text-golden-yellow" /> Week {weekNumber} Results
        </h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Winners</h3>
          <p className="text-dark-slate">
            {weekData.winners.length > 0 ? `${weekData.winners.join(', ')} (Score: ${weekData.winnerScore})` : 'None'}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">2nd Place</h3>
          <p className="text-dark-slate">
            {weekData.secondPlace.length > 0 ? `${weekData.secondPlace.join(', ')} (Score: ${weekData.secondPlaceScore})` : 'None'}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Highest Score</h3>
          <p className="text-dark-slate">
            {weekData.thirdPlace.length > 0 ? `${weekData.thirdPlace.join(', ')} (Score: ${weekData.thirdPlaceScore})` : 'None'}
          </p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Deuce Pot Winner</h3>
          <p className="text-dark-slate">{weekData.deucePotWinner || 'None'}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark-slate mb-2">Closest to Pin Winner</h3>
          <p className="text-dark-slate">{weekData.closestToPinWinner || 'None'}</p>
        </div>
      </div>
    </div>
  );
}

export default WeekStats;