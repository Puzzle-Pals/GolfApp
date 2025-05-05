import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminSection from './components/AdminSection';
import StatsSection from './components/StatsSection';
import PlayerStats from './components/PlayerStats';
import WeekStats from './components/WeekStats';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Men’s Golf League Tracker</h1>
            <div className="space-x-4">
              <Link to="/stats" className="text-white hover:text-gray-200">Stats</Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/admin" element={<AdminSection />} />
            <Route path="/stats" element={<StatsSection />} />
            <Route path="/stats/:playerName" element={<PlayerStats />} />
            <Route path="/stats/:playerName/week/:weekNumber" element={<WeekStats />} />
            <Route path="/" element={<StatsSection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;