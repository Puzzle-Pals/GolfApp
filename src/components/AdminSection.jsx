import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminSection() {
  const [players, setPlayers] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [weekData, setWeekData] = useState({
    weekNumber: '',
    winnerPlayer1: '',
    winnerPlayer2: '',
    winnerScore: '',
    secondPlacePlayer1: '',
    secondPlacePlayer2: '',
    secondPlaceScore: '',
    lowestScorePlayer1: '',
    lowestScorePlayer2: '',
    lowestScoreScore: '',
    deucePotWinner: '',
    closestToPinWinner: ''
  });
  const [editingWeek, setEditingWeek] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editPlayerName, setEditPlayerName] = useState('');

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const storedWeeks = JSON.parse(localStorage.getItem('weeks') || '[]');
    setPlayers(storedPlayers);
    setWeeks(storedWeeks);

    // Auto-select next week number
    const maxWeek = storedWeeks.length > 0 ? Math.max(...storedWeeks.map(w => w.weekNumber)) : 0;
    setWeekData(prev => ({ ...prev, weekNumber: (maxWeek + 1).toString() }));
  }, []);

  // Convert score to relative-to-par format (assuming par 37, used only for table)
  const formatScore = (score) => {
    const par = 37;
    const relativeScore = score - par;
    if (relativeScore > 0) return `+${relativeScore}`;
    if (relativeScore === 0) return '0';
    return relativeScore.toString();
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const updatedPlayers = [...players];
    if (!updatedPlayers.find(p => p.name === newPlayerName)) {
      updatedPlayers.push({
        name: newPlayerName,
        gamesPlayed: 0,
        wins: 0,
        secondPlace: 0,
        thirdPlace: 0,
        deucePotWins: 0,
        closestToPinWins: 0,
        scores: []
      });
      setPlayers(updatedPlayers);
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
      setNewPlayerName('');
    }
  };

  const startEditPlayer = (player) => {
    setEditingPlayer(player.name);
    setEditPlayerName(player.name);
  };

  const saveEditPlayer = () => {
    if (!editPlayerName.trim() || editPlayerName === editingPlayer) return;
    if (players.find(p => p.name === editPlayerName)) return; // Prevent duplicate names

    // Update player name in players
    const updatedPlayers = players.map(p =>
      p.name === editingPlayer ? { ...p, name: editPlayerName } : p
    );

    // Update player name in weeks
    const updatedWeeks = weeks.map(week => ({
      ...week,
      teams: week.teams.map(team => ({
        ...team,
        player1: team.player1 === editingPlayer ? editPlayerName : team.player1,
        player2: team.player2 === editingPlayer ? editPlayerName : team.player2
      })),
      deucePotWinner: week.deucePotWinner === editingPlayer ? editPlayerName : week.deucePotWinner,
      closestToPinWinner: week.closestToPinWinner === editingPlayer ? editPlayerName : week.closestToPinWinner
    }));

    setPlayers(updatedPlayers);
    setWeeks(updatedWeeks);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    localStorage.setItem('weeks', JSON.stringify(updatedWeeks));
    setEditingPlayer(null);
    setEditPlayerName('');
  };

  const deletePlayer = (playerName) => {
    // Remove player from players
    const updatedPlayers = players.filter(p => p.name !== playerName);

    // Remove player references from weeks (optional: could keep as placeholder)
    const updatedWeeks = weeks.map(week => ({
      ...week,
      teams: week.teams.map(team => ({
        ...team,
        player1: team.player1 === playerName ? '[Deleted Player]' : team.player1,
        player2: team.player2 === playerName ? '[Deleted Player]' : team.player2
      })),
      deucePotWinner: week.deucePotWinner === playerName ? '' : week.deucePotWinner,
      closestToPinWinner: week.closestToPinWinner === playerName ? '' : week.closestToPinWinner
    }));

    setPlayers(updatedPlayers);
    setWeeks(updatedWeeks);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    localStorage.setItem('weeks', JSON.stringify(updatedWeeks));
  };

  const addWeek = () => {
    if (
      !weekData.weekNumber ||
      !weekData.winnerPlayer1 ||
      !weekData.winnerPlayer2 ||
      !weekData.winnerScore ||
      !weekData.secondPlacePlayer1 ||
      !weekData.secondPlacePlayer2 ||
      !weekData.secondPlaceScore ||
      !weekData.lowestScorePlayer1 ||
      !weekData.lowestScorePlayer2 ||
      !weekData.lowestScoreScore
    ) return;

    let updatedWeeks = [...weeks];
    let updatedPlayers = [...players];

    const newWeek = {
      weekNumber: parseInt(weekData.weekNumber),
      teams: [
        {
          player1: weekData.winnerPlayer1,
          player2: weekData.winnerPlayer2,
          score: parseInt(weekData.winnerScore),
          placement: 'winner'
        },
        {
          player1: weekData.secondPlacePlayer1,
          player2: weekData.secondPlacePlayer2,
          score: parseInt(weekData.secondPlaceScore),
          placement: 'secondPlace'
        },
        {
          player1: weekData.lowestScorePlayer1,
          player2: weekData.lowestScorePlayer2,
          score: parseInt(weekData.lowestScoreScore),
          placement: 'lowestScore'
        }
      ],
      deucePotWinner: weekData.deucePotWinner,
      closestToPinWinner: weekData.closestToPinWinner
    };

    // Update player stats
    updatedPlayers = updatedPlayers.map(player => {
      let updatedPlayer = { ...player };
      const team = newWeek.teams.find(t => t.player1 === player.name || t.player2 === player.name);
      if (team) {
        updatedPlayer.gamesPlayed += 1;
        updatedPlayer.scores.push(team.score);
        if (team.placement === 'winner') {
          updatedPlayer.wins += 1;
        } else if (team.placement === 'secondPlace') {
          updatedPlayer.secondPlace += 1;
        } else if (team.placement === 'lowestScore') {
          updatedPlayer.thirdPlace += 1; // Used for Highest Score
        }
      }
      if (newWeek.deucePotWinner === player.name) {
        updatedPlayer.deucePotWins += 1;
      }
      if (newWeek.closestToPinWinner === player.name) {
        updatedPlayer.closestToPinWins += 1;
      }
      return updatedPlayer;
    });

    if (editingWeek) {
      // Update existing week
      updatedWeeks = updatedWeeks.map(w =>
        w.weekNumber === editingWeek.weekNumber ? newWeek : w
      );
      // Reverse previous stats and apply new ones
      updatedPlayers = players.map(player => {
        let updatedPlayer = { ...player };
        const oldTeam = editingWeek.teams.find(t => t.player1 === player.name || t.player2 === player.name);
        if (oldTeam) {
          updatedPlayer.gamesPlayed -= 1;
          updatedPlayer.scores = updatedPlayer.scores.filter(s => s !== oldTeam.score);
          if (oldTeam.placement === 'winner') {
            updatedPlayer.wins -= 1;
          } else if (oldTeam.placement === 'secondPlace') {
            updatedPlayer.secondPlace -= 1;
          } else if (oldTeam.placement === 'lowestScore') {
            updatedPlayer.thirdPlace -= 1;
          }
        }
        if (editingWeek.deucePotWinner === player.name) {
          updatedPlayer.deucePotWins -= 1;
        }
        if (editingWeek.closestToPinWinner === player.name) {
          updatedPlayer.closestToPinWins -= 1;
        }
        const newTeam = newWeek.teams.find(t => t.player1 === player.name || t.player2 === player.name);
        if (newTeam) {
          updatedPlayer.gamesPlayed += 1;
          updatedPlayer.scores.push(newTeam.score);
          if (newTeam.placement === 'winner') {
            updatedPlayer.wins += 1;
          } else if (newTeam.placement === 'secondPlace') {
            updatedPlayer.secondPlace += 1;
          } else if (team.placement === 'lowestScore') {
            updatedPlayer.thirdPlace += 1;
          }
        }
        if (newWeek.deucePotWinner === player.name) {
          updatedPlayer.deucePotWins += 1;
        }
        if (newWeek.closestToPinWinner === player.name) {
          updatedPlayer.closestToPinWins += 1;
        }
        return updatedPlayer;
      });
    } else {
      // Add new week
      updatedWeeks.push(newWeek);
    }

    updatedWeeks.sort((a, b) => a.weekNumber - b.weekNumber);
    setPlayers(updatedPlayers);
    setWeeks(updatedWeeks);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    localStorage.setItem('weeks', JSON.stringify(updatedWeeks));
    setWeekData({
      weekNumber: editingWeek ? (parseInt(weekData.weekNumber) + 1).toString() : (parseInt(weekData.weekNumber) + 1).toString(),
      winnerPlayer1: '',
      winnerPlayer2: '',
      winnerScore: '',
      secondPlacePlayer1: '',
      secondPlacePlayer2: '',
      secondPlaceScore: '',
      lowestScorePlayer1: '',
      lowestScorePlayer2: '',
      lowestScoreScore: '',
      deucePotWinner: '',
      closestToPinWinner: ''
    });
    setEditingWeek(null);
  };

  const startEditWeek = (week) => {
    setEditingWeek(week);
    setWeekData({
      weekNumber: week.weekNumber.toString(),
      winnerPlayer1: week.teams.find(t => t.placement === 'winner')?.player1 || '',
      winnerPlayer2: week.teams.find(t => t.placement === 'winner')?.player2 || '',
      winnerScore: week.teams.find(t => t.placement === 'winner')?.score.toString() || '',
      secondPlacePlayer1: week.teams.find(t => t.placement === 'secondPlace')?.player1 || '',
      secondPlacePlayer2: week.teams.find(t => t.placement === 'secondPlace')?.player2 || '',
      secondPlaceScore: week.teams.find(t => t.placement === 'secondPlace')?.score.toString() || '',
      lowestScorePlayer1: week.teams.find(t => t.placement === 'lowestScore')?.player1 || '',
      lowestScorePlayer2: week.teams.find(t => t.placement === 'lowestScore')?.player2 || '',
      lowestScoreScore: week.teams.find(t => t.placement === 'lowestScore')?.score.toString() || '',
      deucePotWinner: week.deucePotWinner || '',
      closestToPinWinner: week.closestToPinWinner || ''
    });
  };

  const deleteWeek = (weekNumber) => {
    const weekToDelete = weeks.find(w => w.weekNumber === weekNumber);
    if (!weekToDelete) return;

    // Reverse player stats
    let updatedPlayers = players.map(player => {
      let updatedPlayer = { ...player };
      const team = weekToDelete.teams.find(t => t.player1 === player.name || t.player2 === player.name);
      if (team) {
        updatedPlayer.gamesPlayed -= 1;
        updatedPlayer.scores = updatedPlayer.scores.filter(s => s !== team.score);
        if (team.placement === 'winner') {
          updatedPlayer.wins -= 1;
        } else if (team.placement === 'secondPlace') {
          updatedPlayer.secondPlace -= 1;
        } else if (team.placement === 'lowestScore') {
          updatedPlayer.thirdPlace -= 1;
        }
      }
      if (weekToDelete.deucePotWinner === player.name) {
        updatedPlayer.deucePotWins -= 1;
      }
      if (weekToDelete.closestToPinWinner === player.name) {
        updatedPlayer.closestToPinWins -= 1;
      }
      return updatedPlayer;
    });

    // Remove week
    const updatedWeeks = weeks.filter(w => w.weekNumber !== weekNumber);
    setPlayers(updatedPlayers);
    setWeeks(updatedWeeks);
    localStorage.setItem('players', JSON.stringify(updatedPlayers));
    localStorage.setItem('weeks', JSON.stringify(updatedWeeks));
  };

  // Sort players by first name
  const sortedPlayers = [...players].sort((a, b) => {
    const firstNameA = a.name.split(' ')[0].toLowerCase();
    const firstNameB = b.name.split(' ')[0].toLowerCase();
    return firstNameA.localeCompare(firstNameB);
  });

  // Generate week numbers 1 to 99
  const weekNumbers = Array.from({ length: 99 }, (_, i) => (i + 1).toString());

  // Format week details for table
  const formatWeekDetails = (week) => {
    const teamDetails = week.teams.map(team => 
      `${team.placement === 'winner' ? 'Winners' : team.placement === 'secondPlace' ? '2nd place' : 'Highest score'} - ${team.player1} & ${team.player2}: ${formatScore(team.score)}`
    ).join(', ');
    const deucePot = week.deucePotWinner ? `, Deuce Pot: ${week.deucePotWinner}` : '';
    const closestToPin = week.closestToPinWinner ? `, Closest to Pin: ${week.closestToPinWinner}` : '';
    return `Week ${week.weekNumber}: ${teamDetails}${deucePot}${closestToPin}`;
  };

  // Get unique players for a week
  const getWeekPlayers = (week) => {
    const players = new Set();
    week.teams.forEach(team => {
      players.add(team.player1);
      players.add(team.player2);
    });
    return Array.from(players).join(', ');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Section</h2>

      {/* Add Player Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add New Player</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player Name (e.g., John Doe)"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addPlayer}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Player
          </button>
        </div>
      </div>

      {/* Add/Edit Week Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">{editingWeek ? 'Edit Week Results' : 'Add Week Results'}</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Week Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Week Number</label>
            <select
              value={weekData.weekNumber}
              onChange={(e) => setWeekData({ ...weekData, weekNumber: e.target.value })}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              {weekNumbers.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* Winner Team */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Winner</label>
            <div className="grid grid-cols-3 gap-4">
              <select
                value={weekData.winnerPlayer1}
                onChange={(e) => setWeekData({ ...weekData, winnerPlayer1: e.target.value })}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Player 1</option>
                {sortedPlayers.map(player => (
                  <option key={player.name} value={player.name}>{player.name}</option>
                ))}
              </select>
              <select
                value={weekData.winnerPlayer2}
                onChange={(e) => setWeekData({ ...weekData, winnerPlayer2: e.target.value })}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Player 2</option>
                {sortedPlayers.map(player => (
                  <option key={player.name} value={player.name}>{player.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={weekData.winnerScore}
                onChange={(e) => setWeekData({ ...weekData, winnerScore: e.target.value })}
                placeholder="Score"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 2nd Place Team */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2nd Place</label>
            <div className="grid grid-cols-3 gap-4">
              <select
                value={weekData.secondPlacePlayer1}
                onChange={(e) => setWeekData({ ...weekData, secondPlacePlayer1: e.target.value })}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Player 1</option>
                {sortedPlayers.map(player => (
                  <option key={player.name} value={player.name}>{player.name}</option>
                ))}
              </select>
              <select
                value={weekData.secondPlacePlayer2}
                onChange={(e) => setWeekData({ ...weekData, secondPlacePlayer2: e.target.value })}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Player 2</option>
                {sortedPlayers.map(player => (
                  <option key={player.name} value={player.name}>{player.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={weekData.secondPlaceScore}
                onChange={(e) => setWeekData({ ...weekData, secondPlaceScore: e.target.value })}
                placeholder="Score"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Lowest Score Team */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lowest Score</label>
            <div className="grid grid-cols-3 gap-4">
              <select
                value={weekData.lowestScorePlayer1}
                onChange={(e) => setWeekData({ ...weekData, lowestScorePlayer1: e.target.value })}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Player 1</option>
                {sortedPlayers.map(player => (
                  <option key={player.name} value={player.name}>{player.name}</option>
                ))}
              </select>
              <select
                value={weekData.lowestScorePlayer2}
                onChange={(e) => setWeekData({ ...weekData, lowestScorePlayer2: e.target.value })}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Player 2</option>
                {sortedPlayers.map(player => (
                  <option key={player.name} value={player.name}>{player.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={weekData.lowestScoreScore}
                onChange={(e) => setWeekData({ ...weekData, lowestScoreScore: e.target.value })}
                placeholder="Score"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Deuce Pot Winner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deuce Pot Winner</label>
            <select
              value={weekData.deucePotWinner}
              onChange={(e) => setWeekData({ ...weekData, deucePotWinner: e.target.value })}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">Select Winner</option>
              {sortedPlayers.map(player => (
                <option key={player.name} value={player.name}>{player.name}</option>
              ))}
            </select>
          </div>

          {/* Closest to Pin Winner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Closest to Pin Winner</label>
            <select
              value={weekData.closestToPinWinner}
              onChange={(e) => setWeekData({ ...weekData, closestToPinWinner: e.target.value })}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">Select Winner</option>
              {sortedPlayers.map(player => (
                <option key={player.name} value={player.name}>{player.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={addWeek}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {editingWeek ? 'Update Week' : 'Add Week'}
          </button>
          {editingWeek && (
            <button
              onClick={() => {
                setEditingWeek(null);
                setWeekData({
                  weekNumber: (parseInt(weekData.weekNumber) + 1).toString(),
                  winnerPlayer1: '',
                  winnerPlayer2: '',
                  winnerScore: '',
                  secondPlacePlayer1: '',
                  secondPlacePlayer2: '',
                  secondPlaceScore: '',
                  lowestScorePlayer1: '',
                  lowestScorePlayer2: '',
                  lowestScoreScore: '',
                  deucePotWinner: '',
                  closestToPinWinner: ''
                });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Weeks Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">All Weeks</h3>
        {weeks.length === 0 ? (
          <p className="text-gray-600">No weeks added yet.</p>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Names</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weeks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {weeks.map(week => (
                  <tr key={week.weekNumber}>
                    <td className="px-6 py-4 whitespace-nowrap">{getWeekPlayers(week)}</td>
                    <td className="px-6 py-4">{formatWeekDetails(week)}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => startEditWeek(week)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteWeek(week.weekNumber)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Players List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">All Players</h3>
        {sortedPlayers.length === 0 ? (
          <p className="text-gray-600">No players added yet.</p>
        ) : (
          <ul className="space-y-2">
            {sortedPlayers.map(player => (
              <li key={player.name} className="flex items-center justify-between">
                {editingPlayer === player.name ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editPlayerName}
                      onChange={(e) => setEditPlayerName(e.target.value)}
                      className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={saveEditPlayer}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPlayer(null)}
                      className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <Link
                      to={`/stats/${encodeURIComponent(player.name)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {player.name}
                    </Link>
                    <div className="space-x-2">
                      <button
                        onClick={() => startEditPlayer(player)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePlayer(player.name)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminSection;