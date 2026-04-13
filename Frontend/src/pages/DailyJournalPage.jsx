import { useState } from 'react';

export default function DailyJournalPage() {
  const [status, setStatus] = useState('idle');
  const [log, setLog] = useState('');

  const handleTrigger = async () => {
    setStatus('running');
    setLog(`Initializing headless browser for manual login...`);
    
    try {
      // Switched from "http://localhost:3001" to purely relative "/" to work beautifully on the bundled unified server.
      const response = await fetch('/api/trigger-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc8RRUAG8n8nPB9dm21m_MxwHQ-JuDnEj7GnvwEkWXykkKFuQ/viewform',
          message: 'Completed scheduled tasks.'
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
        <p className="text-neutral-400 mb-8">Click the button below to start the automation. Standard Google login will be prompted if required.</p>
        
        <button 
          onClick={handleTrigger}
          disabled={status === 'running'}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-md font-medium transition-colors mb-8"
        >
          {status === 'running' ? 'Running Automation...' : 'Trigger Automation'}
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
