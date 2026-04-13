import { useState } from 'react';

export default function DailyJournalPage() {
  const [status, setStatus] = useState('idle');
  const [log, setLog] = useState('');
  const [fullName, setFullName] = useState('');
  const [squad, setSquad] = useState('');

  const handleTrigger = async () => {
    if (!fullName.trim() || !squad.trim()) {
      setStatus('error');
      setLog('Error: Please enter your full name and squad number.');
      return;
    }

    // Format the email ID based on "vansh thapar" -> "vansh.thapar"
    const formattedName = fullName.trim().toLowerCase().replace(/\s+/g, '.');
    const emailId = `${formattedName}.s${squad}@kalvium.community`.toLowerCase();

    setStatus('running');
    setLog(`Initializing headless browser for ${emailId}...`);
    
    try {
      // Switched from "http://localhost:3001" to purely relative "/" to work beautifully on the bundled unified server.
      const response = await fetch('/api/trigger-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc8RRUAG8n8nPB9dm21m_MxwHQ-JuDnEj7GnvwEkWXykkKFuQ/viewform',
          message: 'Completed tasks for EasyLife automation setup.',
          email: emailId
        })
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setLog(`Success: ${data.message}`);
      } else {
        throw new Error(data.message || 'Automation failed');
      }
    } catch (error) {
      setStatus('error');
      setLog(`Error: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Daily Journal Auto-Submit</h1>
        <p className="text-neutral-400 mb-8">Enter your Kalvium credentials to log in and automatically fill out the form.</p>
        
        <div className="flex flex-col gap-4 mb-8">
          <input 
            type="text"
            placeholder="Full Name (e.g. Vansh Thapar) "
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-3 text-neutral-100 focus:outline-none focus:border-blue-500"
          />
          <input 
            type="text"
            placeholder="Squad Number (e.g. 85)"
            value={squad}
            onChange={(e) => setSquad(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-3 text-neutral-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button 
          onClick={handleTrigger}
          disabled={status === 'running'}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-md font-medium transition-colors mb-8"
        >
          {status === 'running' ? 'Running Automation...' : 'Construct Email & Trigger Automation'}
        </button>

        <div className="bg-black border border-neutral-800 rounded-xl p-6 font-mono text-sm h-64 overflow-y-auto">
          <div className="text-neutral-500 mb-2">// Execution Logs</div>
          <div className={status === 'error' ? 'text-red-400' : 'text-green-400'}>
            {log || 'Awaiting execution...'}
          </div>
        </div>
      </div>
    </main>
  );
}
