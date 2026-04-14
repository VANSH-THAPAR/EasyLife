import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DailyJournalPage from './pages/DailyJournalPage';
import Layout from './Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily-journal" element={<DailyJournalPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
