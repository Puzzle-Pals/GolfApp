import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGolfBall, FaSave } from 'react-icons/fa';

function AddWeek() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [weekData, setWeekData] = useState({
    weekNumber: 1,
    winners: [],
    winnerScore: '',
    secondPlace: [],
    secondPlaceScore: '',
    thirdPlace: [],
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

  const handleMultiSelect = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setWeekData(prev => ({ ...prev, [field]: selectedOptions }));
  };

  const saveWeek = () => {
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    if (storedWeeks.some(w => w.weekNumber === weekData.weekNumber)) {
      alert('Week number already exists.');
      return;
    }

    const newWeek = {
      ...weekData,
      winnerScore: parseFloat(weekData.winnerScore) || 0,
      secondPlaceScore: parseFloat(weekData.secondPlaceScore) || 0,
      thirdPlaceScore: parseFloat(weekData.thirdPlaceScore) || 0
    };
    storedWeeks.push(newWeek);
    localStorage.setItem('weeks', JSON.stringify(storedWeeks));

    const updatedPlayers = players.map(player => {
      let gamesPlayed = player.gamesPlayed || 0;
      let wins = player.wins || 0;
      let secondPlace = player.secondPlace || 0;
      let thirdPlace = player.thirdPlace || 0;
      let deucePotWins = player.deucePotWins || 0;
      let closestToPinWins = player.closestToPinWins || 0;
      let scores = player.scores || [];

      if (weekData.winners.includes(player.name)) {
        gamesPlayed += 1;
        wins += 1;
        scores.push(parseFloat(weekData.winnerScore) || 0);
      } else if (weekData.secondPlace.includes(player.name)) {
        gamesPlayed += 1;
        secondPlace += 1;
        scores.push(parseFloat(weekData.secondPlaceScore) || 0);
      } else if (weekData.thirdPlace.includes(player.name)) {
        gamesPlayed += 1;
        thirdPlace += 1;
        scores.push(parseFloat(weekData.thirdPlaceScore) || 0);
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
        secondPlace,
        thirdPlace,
        deucePotWins,
        closestToPinWins,
        scores
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
          <select
            multiple
            value={weekData.winners}
            onChange={(e) => handleMultiSelect(e, 'winners')}
            className="select w-full"
          >
            {players.map(player => (
              <option key={player.name} value={player.name}>{player.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">Winner Score</label>
          <input
            type="number"
            name="winnerScore"
            value={weekData.winnerScore}
            onChange={handleChange}
            className="input w-full"
            step="0.1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">2nd Place</label>
          <select
            multiple
            value={weekData.secondPlace}
            onChange={(e) => handleMultiSelect(e, 'secondPlace')}
            className="select w-full"
          >
            {players.map(player => (
              <option key={player.name} value={player.name}>{player.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">2nd Place Score</label>
          <input
            type="number"
            name="secondPlaceScore"
            value={weekData.secondPlaceScore}
            onChange={handleChange}
            className="input w-full"
            step="0.1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">Highest Score</label>
          <select
            multiple
            value={weekData.thirdPlace}
            onChange={(e) => handleMultiSelect(e, 'thirdPlace')}
            className="select w-full"
          >
            {players.map(player => (
              <option key={player.name} value={player.name}>{player.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-dark-slate mb-1">Highest Score Value</label>
          <input
            type="number"
            name="thirdPlaceScore"
            value={weekData.thirdPlaceScore}
            onChange={handleChange}
            className="input w-full"
            step="0.1"
          />
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