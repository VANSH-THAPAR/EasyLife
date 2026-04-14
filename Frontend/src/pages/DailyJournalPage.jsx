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
        
        <div className="mb-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-white border-b border-neutral-700 pb-2">EasyLife Setup & Usage Guide 🚀</h2>
          
          <div className="space-y-6 text-neutral-300">
            <section>
              <h3 className="text-xl font-semibold mb-2 text-white">1. Requirements</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Node.js</strong> (v18 or above recommended)</li>
                <li><strong>Google Chrome</strong> browser (used natively, make sure to close all instances before running)</li>
                <li><strong>Git</strong> (for cloning)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2 text-white">2. Installation 🛠️</h3>
              <p className="mb-2 text-sm text-neutral-400">Run the following in your terminal based on your OS:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black p-4 rounded-lg border border-neutral-800">
                  <h4 className="text-white font-medium mb-2 text-sm">Windows</h4>
                  <pre className="text-green-400 text-xs overflow-x-auto"><code>git clone https://github.com/VANSH-THAPAR/EasyLife.git
cd EasyLife
npm install
npm run install-os</code></pre>
                  <p className="text-xs text-neutral-500 mt-2 italic">Creates a global <code>vansh</code> CLI and Desktop shortcut.</p>
                </div>
                
                <div className="bg-black p-4 rounded-lg border border-neutral-800">
                  <h4 className="text-white font-medium mb-2 text-sm">macOS / Linux</h4>
                  <pre className="text-green-400 text-xs overflow-x-auto"><code>git clone https://github.com/VANSH-THAPAR/EasyLife.git
cd EasyLife
npm install
npm run install-os</code></pre>
                  <p className="text-xs text-neutral-500 mt-2 italic">Run <code>source ~/.zshrc</code> (or bashrc) after to load the alias.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2 text-white">3. Run Automation Anytime 🤖</h3>
              <p className="mb-2">Once setup is complete, you can trigger the journal from anywhere directly in your terminal:</p>
              <pre className="bg-black text-green-400 p-3 rounded-md overflow-x-auto"><code>vansh fill form</code></pre>
              <p className="mt-2 text-sm">Or if you prefer using this dashboard interface, run <code>node start.js</code> in the EasyLife directory.</p>
              <p className="mt-4 text-sm text-yellow-400">⚠️ <strong>Important:</strong> The automation uses your local Chrome profile. Ensure all Chrome windows are closed before triggering!</p>
            </section>
          </div>
        </div>

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
