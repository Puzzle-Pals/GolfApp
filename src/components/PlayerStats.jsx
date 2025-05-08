import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGolfBall } from 'react-icons/fa';

function PlayerStats() {
  const { playerName } = useParams();
  const [player, setPlayer] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const decodedName = decodeURIComponent(playerName);
      const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
      const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
      
      const foundPlayer = storedPlayers.find(p => p.name === decodedName);
      if (foundPlayer) {
        setPlayer(foundPlayer);
        const playerWeeks = storedWeeks
          .filter(w => 
            w.teams.some(t => t.player1 === decodedName || t.player2 === decodedName) ||
            w.deucePotWinner === decodedName ||
            w.closestToPinWinner === decodedName
          )
          .sort((a, b) => a.weekNumber - b.weekNumber);
        setWeeks(playerWeeks);
        setError('');
      } else {
        setError('Player not found.');
      }
    } catch (e) {
      console.error('Error fetching player data:', e);
      setError('Failed to load player data.');
    }
  }, [playerName]);

  const formatScore = (score) => {
    const par = 37;
    const relativeScore = score - par;
    if (relativeScore > 0) return `+${relativeScore}`;
    if (relativeScore === 0) return 'E';
    return relativeScore.toString();
  };

  const getAverageScore = (scores) => {
    if (!scores || scores.length === 0) return '-';
    const validScores = scores.filter(score => typeof score === 'number' && !isNaN(score));
    if (validScores.length === 0) return '-';
    const average = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
    return average.toFixed(1);
  };

  if (error) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-emerald-green">{error}</h2>
        </div>
      </div>
    );
  }

  if (!player) {
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
            <FaGolfBall className="mr-2 text-golden-yellow" /> {player.name} Stats
          </h2>
          <Link
            to="/stats"
            className="text-sky-blue hover:text-coral-red text-sm font-semibold"
          >
            Back to Player Stats
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-dark-slate"><strong>Games Played:</strong> {player.gamesPlayed || 0}</p>
            <p className="text-dark-slate"><strong>Wins:</strong> {player.wins || 0}</p>
            <p className="text-dark-slate"><strong>2nd Place:</strong> {player.secondPlace || 0}</p>
            <p className="text-dark-slate"><strong>Highest Score:</strong> {player.thirdPlace || 0}</p>
          </div>
          <div>
            <p className="text-dark-slate"><strong>Deuce Pot Wins:</strong> {player.deucePotWins || 0}</p>
            <p className="text-dark-slate"><strong>Closest to Pin Wins:</strong> {player.closestToPinWins || 0}</p>
            <p className="text-dark-slate"><strong>Average Score:</strong> {getAverageScore(player.scores)}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-dark-slate mb-4">Week-by-Week Performance</h3>
        {weeks.length === 0 ? (
          <p className="text-dark-slate">No weeks recorded for this player.</p>
        ) : (
          <div className="space-y-4">
            {weeks.map(week => {
              const team = week.teams.find(t => t.player1 === player.name || t.player2 === player.name);
              return (
                <div key={week.weekNumber} className="border-b border-cream-white pb-2">
                  <h4 className="text-lg font-semibold text-dark-slate">Week {week.weekNumber}</h4>
                  {team ? (
                    <p className="text-dark-slate">
                      {team.placement === 'winner' ? 'Winners' : 
                       team.placement === 'secondPlace' ? '2nd Place' : 'Highest Score'}: 
                      {team.player1} & {team.player2} - Score: {formatScore(team.score)}
                    </p>
                  ) : (
                    <p className="text-dark-slate">Did not play in a team.</p>
                  )}
                  {week.deucePotWinner === player.name && (
                    <p className="text-dark-slate">Deuce Pot Winner</p>
                  )}
                  {week.closestToPinWinner === player.name && (
                    <p className="text-dark-slate">Closest to Pin Winner</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerStats;