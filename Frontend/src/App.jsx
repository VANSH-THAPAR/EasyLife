import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DailyJournalPage from './pages/DailyJournalPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/daily-journal" element={<DailyJournalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
