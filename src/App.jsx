import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminSection from './components/AdminSection';
import StatsSection from './components/StatsSection';
import PlayerStats from './components/PlayerStats';
import WeekStats from './components/WeekStats';
import WeekDetails from './components/WeekDetails';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('adminPassword');

    if (!storedPassword) {
      // First-time setup: set the password
      if (passwordInput.trim()) {
        localStorage.setItem('adminPassword', passwordInput);
        setIsAuthenticated(true);
        setPasswordInput('');
        setIsSettingPassword(false);
        setError('');
      } else {
        setError('Please enter a valid password.');
      }
    } else {
      // Check existing password
      if (passwordInput === storedPassword) {
        setIsAuthenticated(true);
        setPasswordInput('');
        setError('');
      } else {
        setError('Incorrect password.');
      }
    }
  };

  const renderAdmin = () => {
    if (!isAuthenticated) {
      return (
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isSettingPassword || !localStorage.getItem('adminPassword') ? 'Set Admin Password' : 'Enter Admin Password'}
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>
              {error && <p className="text-red-600 mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {isSettingPassword || !localStorage.getItem('adminPassword') ? 'Set Password' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      );
    }
    return <AdminSection />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Thursday Night Men's League - Lake of the Sandhills Golf Course</h1>
            <div className="space-x-4">
              <Link to="/stats" className="text-white hover:text-gray-200">Player Stats</Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/admin" element={renderAdmin()} />
            <Route path="/stats" element={<StatsSection />} />
            <Route path="/stats/:playerName" element={<PlayerStats />} />
            <Route path="/stats/:playerName/week/:weekNumber" element={<WeekStats />} />
            <Route path="/week/:weekNumber" element={<WeekDetails />} />
            <Route path="/" element={<StatsSection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;