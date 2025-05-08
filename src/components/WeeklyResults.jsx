import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGolfBall } from 'react-icons/fa';

function WeeklyResults() {
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    try {
      const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
      setWeeks(storedWeeks.sort((a, b) => a.weekNumber - b.weekNumber));
    } catch (e) {
      console.error('Error fetching weeks:', e);
    }
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold text-emerald-green flex items-center mb-4">
          <FaGolfBall className="mr-2 text-golden-yellow" /> Weekly Results
        </h2>
        {weeks.length === 0 ? (
          <p className="text-dark-slate">No weeks added yet.</p>
        ) : (
          <ul className="space-y-4">
            {weeks.map(week => (
              <li key={week.weekNumber} className="border-b border-cream-white pb-2">
                <Link
                  to={`/week/${week.weekNumber}`}
                  className="text-dark-slate hover:text-coral-red font-semibold text-base"
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

export default WeeklyResults;