import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import League from './components/League';
import StatsSection from './components/StatsSection';
import Leaderboard from './components/Leaderboard';
import AdminSection from './components/AdminSection';
import PlayerStats from './components/PlayerStats';
import WeekStats from './components/WeekStats';
import WeeklyResults from './components/WeeklyResults';
import AddWeek from './components/AddWeek';
import EditWeek from './components/EditWeek';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="navbar-brand">
            <a href="/">BP Men's League</a>
          </div>
          <div className="navbar-links">
            <a href="/stats">Player Stats</a>
            <a href="/leaderboard">Leaderboard</a>
            <a href="/weekly-results">Weekly Results</a>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<League />} />
          <Route path="/stats" element={<StatsSection />} />
          <Route path="/stats/:playerName" element={<PlayerStats />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/weekly-results" element={<WeeklyResults />} />
          <Route path="/week/:weekNumber" element={<WeekStats />} />
          <Route path="/admin" element={<AdminSection />} />
          <Route path="/admin/add-week" element={<AddWeek />} />
          <Route path="/admin/edit-week/:weekNumber" element={<EditWeek />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;