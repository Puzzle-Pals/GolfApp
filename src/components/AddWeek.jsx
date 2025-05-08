import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGolfBall, FaSave } from 'react-icons/fa';

function AddWeek() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [weekData, setWeekData] = useState({
    weekNumber: 1,
    winner1: '',
    winner2: '',
    winnerScore: '',
    secondPlace1: '',
    secondPlace2: '',
    secondPlaceScore: '',
    thirdPlace1: '',
    thirdPlace2: '',
    thirdPlaceScore: '',
    deucePotWinner: '',
    closestToPinWinner: ''
  });

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    const nextWeekNumber = storedWeeks.length > 0 ? Math.max(...storedWeeks.map(w => w.weekNumber)) + 1 : 1;
    setWeekData(prev => ({ ...prev, weekNumber: nextWeekNumber }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWeekData(prev => ({ ...prev, [name]: value }));
  };

  const getAvailablePlayers = (excludeField) => {
    const selectedPlayers = [
      weekData.winner1,
      weekData.winner2,
      weekData.secondPlace1,
      weekData.secondPlace2,
      weekData.thirdPlace1,
      weekData.thirdPlace2
    ].filter((player, index, self) => player && self.indexOf(player) === index && player !== weekData[excludeField]);
    return players.filter(player => !selectedPlayers.includes(player.name));
  };

  const saveWeek = () => {
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    if (storedWeeks.some(w => w.weekNumber === weekData.weekNumber)) {
      alert('Week number already exists.');
      return;
    }

    const winners = [weekData.winner1, weekData.winner2].filter(Boolean);
    const secondPlace = [weekData.secondPlace1, weekData.secondPlace2].filter(Boolean);
    const thirdPlace = [weekData.thirdPlace1, weekData.thirdPlace2].filter(Boolean);

    const newWeek = {
      weekNumber: weekData.weekNumber,
      winners,
      winnerScore: parseFloat(weekData.winnerScore) || 0,
      secondPlace,
      secondPlaceScore: parseFloat(weekData.secondPlaceScore) || 0,
      thirdPlace,
      thirdPlaceScore: parseFloat(weekData.thirdPlaceScore) || 0,
      deucePotWinner: weekData.deucePotWinner,
      closestToPinWinner: weekData.closestToPinWinner
    };

    storedWeeks.push(newWeek);
    localStorage.setItem('weeks', JSON.stringify(storedWeeks));

    const pointsSystemEnabled = JSON.parse(localStorage.getItem('pointsSystemEnabled') || 'false');

    const updatedPlayers = players.map(player => {
      let gamesPlayed = player.gamesPlayed || 0;
      let wins = player.wins || 0;
      let secondPlaceCount = player.secondPlace || 0;
      let thirdPlaceCount = player.thirdPlace || 0;
      let deucePotWins = player.deucePotWins || 0;
      let closestToPinWins = player.closestToPinWins || 0;
      let scores = player.scores || [];
      let points = player.points || 0;

      if (winners.includes(player.name)) {
        gamesPlayed += 1;
        wins += 1;
        scores.push(parseFloat(weekData.winnerScore) || 0);
        if (pointsSystemEnabled) points += 3;
      } else if (secondPlace.includes(player.name)) {
        gamesPlayed += 1;
        secondPlaceCount += 1;
        scores.push(parseFloat(weekData.secondPlaceScore) || 0);
        if (pointsSystemEnabled) points += 2;
      } else if (thirdPlace.includes(player.name)) {
        gamesPlayed += 1;
        thirdPlaceCount += 1;
        scores.push(parseFloat(weekData.thirdPlaceScore) || 0);
        if (pointsSystemEnabled) points += 1;
      }
      if (weekData.deucePotWinner === player.name) {
        deucePotWins += 1;
      }
      if (weekData.closestToPinWinner === player.name) {
        closestToPinWins += 1;
      }

      return {
        ...player,
        gamesPlayed,
        wins,
        secondPlace: secondPlaceCount,
        thirdPlace: thirdPlaceCount,
        deucePotWins,
        closestToPinWins,
        scores,
        points
      };
    });

    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    navigate('/admin');
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold text-emerald-green flex items-center mb-4">
          <FaGolfBall className="mr-2 text-golden-yellow" /> Add Week {weekData.weekNumber}
        </h2>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">Winners</label>
          <div className="form-row">
            <select
              name="winner1"
              value={weekData.winner1}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select player</option>
              {getAvailablePlayers('winner1').map(player => (
                <option key={player.name} value={player.name}>{player.name}</option>
              ))}
            </select>
            <select
              name="winner2"
              value={weekData.winner2}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select player</option>
              {getAvailablePlayers('winner2').map(player => (
                <option key={player.name} value={player.name}>{player.name}</option>
              ))}
            </select>
            <input
              type="number"
              name="winnerScore"
              value={weekData.winnerScore}
              onChange={handleChange}
              placeholder="Score"
              className="input"
              step="0.1"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">2nd Place</label>
          <div className="form-row">
            <select
              name="secondPlace1"
              value={weekData.secondPlace1}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select player</option>
              {getAvailablePlayers('secondPlace1').map(player => (
                <option key={player.name} value={player.name}>{player.name}</option>
              ))}
            </select>
            <select
              name="secondPlace2"
              value={weekData.secondPlace2}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select player</option>
              {getAvailablePlayers('secondPlace2').map(player => (
                <option key={player.name} value={player.name}>{player.name}</option>
              ))}
            </select>
            <input
              type="number"
              name="secondPlaceScore"
              value={weekData.secondPlaceScore}
              onChange={handleChange}
              placeholder="Score"
              className="input"
              step="0.1"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">Highest Score</label>
          <div className="form-row">
            <select
              name="thirdPlace1"
              value={weekData.thirdPlace1}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select player</option>
              {getAvailablePlayers('thirdPlace1').map(player => (
                <option key={player.name} value={player.name}>{player.name}</option>
              ))}
            </select>
            <select
              name="thirdPlace2"
              value={weekData.thirdPlace2}
              onChange={handleChange}
              className="select"
            >
              <option value="">Select player</option>
              {getAvailablePlayers('thirdPlace2').map(player => (
                <option key={player.name} value={player.name}>{player.name}</option>
              ))}
            </select>
            <input
              type="number"
              name="thirdPlaceScore"
              value={weekData.thirdPlaceScore}
              onChange={handleChange}
              placeholder="Score"
              className="input"
              step="0.1"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">Deuce Pot Winner</label>
          <select
            name="deucePotWinner"
            value={weekData.deucePotWinner}
            onChange={handleChange}
            className="select w-full"
          >
            <option value="">Select player</option>
            {players.map(player => (
              <option key={player.name} value={player.name}>{player.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">Closest to Pin Winner</label>
          <select
            name="closestToPinWinner"
            value={weekData.closestToPinWinner}
            onChange={handleChange}
            className="select w-full"
          >
            <option value="">Select player</option>
            {players.map(player => (
              <option key={player.name} value={player.name}>{player.name}</option>
            ))}
          </select>
        </div>
        <button onClick={saveWeek} className="btn btn-primary">
          <FaSave className="mr-1" /> Save Week
        </button>
      </div>
    </div>
  );
}

export default AddWeek;