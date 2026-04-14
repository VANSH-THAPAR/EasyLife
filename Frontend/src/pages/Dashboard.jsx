import { Link } from 'react-router-dom';

const tasks = [
  { id: 'daily-journal', title: 'Daily Journal Auto-Submit', description: 'Fills and submits the daily EOD Google Form.', href: '/daily-journal' },
  { id: 'weekly-report', title: 'Weekly Report Generator', description: 'Compiles GitHub commits and Jira tickets into a summary.', href: '#' },
  { id: 'health-check', title: 'Server Health Check', description: 'Pings personal servers and reports uptime.', href: '#' },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">EasyLife Dashboard</h1>
        <p className="text-neutral-400 mb-10">Manage your personal automation pipeline.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="border border-neutral-800 bg-neutral-900 rounded-xl p-6 transition-all hover:border-neutral-700 hover:bg-neutral-800">
              <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
              <p className="text-neutral-400 mb-6 text-sm">{task.description}</p>
              <Link 
                to={task.href}
                className="inline-block bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                View Status / Trigger
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
