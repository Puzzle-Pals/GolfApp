import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminSection from './components/AdminSection';
import StatsSection from './components/StatsSection';
import PlayerStats from './components/PlayerStats';
import WeekStats from './components/WeekStats';
import WeekDetails from './components/WeekDetails';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Thursday Night Men's League - Lake of the Sandhills Golf Course</h1>
            <div className="space-x-4">
              <Link to="/stats" className="text-white hover:text-gray-200">Player Stats</Link>
              <Link to="/leaderboard" className="text-white hover:text-gray-200">Leaderboard</Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/admin" element={<AdminSection />} />
            <Route path="/stats" element={<StatsSection />} />
            <Route path="/stats/:playerName" element={<PlayerStats />} />
            <Route path="/stats/:playerName/week/:weekNumber" element={<WeekStats />} />
            <Route path="/week/:weekNumber" element={<WeekDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/" element={<StatsSection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;