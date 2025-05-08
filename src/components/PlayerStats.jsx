import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaGolfBall } from 'react-icons/fa';

function PlayerStats() {
  const { playerName } = useParams();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const foundPlayer = storedPlayers.find(p => p.name === decodeURIComponent(playerName));
    setPlayer(foundPlayer);
  }, [playerName]);

  if (!player) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="text-2xl font-bold text-emerald-green flex items-center mb-4">
            <FaGolfBall className="mr-2 text-golden-yellow" /> Player Not Found
          </h2>
          <p className="text-dark-slate">No player found with the name {decodeURIComponent(playerName)}.</p>
        </div>
      </div>
    );
  }

  const averageScore = player.scores && player.scores.length > 0
    ? (player.scores.reduce((sum, score) => sum + score, 0) / player.scores.length).toFixed(1)
    : 'N/A';

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold text-emerald-green flex items-center mb-4">
          <FaGolfBall className="mr-2 text-golden-yellow" /> {player.name} Stats
        </h2>
        <table className="min-w-full">
          <tbody>
            <tr className="bg-cream-white">
              <td className="font-semibold">Games Played</td>
              <td>{player.gamesPlayed || 0}</td>
            </tr>
            <tr>
              <td className="font-semibold">Wins</td>
              <td>{player.wins || 0}</td>
            </tr>
            <tr className="bg-cream-white">
              <td className="font-semibold">2nd Place</td>
              <td>{player.secondPlace || 0}</td>
            </tr>
            <tr>
              <td className="font-semibold">Highest Score</td>
              <td>{player.thirdPlace || 0}</td>
            </tr>
            <tr className="bg-cream-white">
              <td className="font-semibold">Deuce Pot Wins</td>
              <td>{player.deucePotWins || 0}</td>
            </tr>
            <tr>
              <td className="font-semibold">Closest to Pin Wins</td>
              <td>{player.closestToPinWins || 0}</td>
            </tr>
            <tr className="bg-cream-white">
              <td className="font-semibold">Average Score</td>
              <td>{averageScore}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlayerStats;