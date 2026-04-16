import { useState } from 'react';
import { Play, TerminalSquare, HardDrive, Network, Globe, Copy, Check, Fingerprint } from 'lucide-react';

const CodeSnippet = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-zinc-800 rounded-lg bg-[#0a0a0a] overflow-hidden mt-2">
      <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-800 bg-[#0f0f11] text-xs text-zinc-500">
        <span className="font-mono">shell</span>
        <button 
          onClick={handleCopy}
          className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? <span className="text-emerald-400">Copied</span> : 'Copy'}
        </button>
      </div>
      <pre className="text-zinc-300 p-4 font-mono text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function DailyJournalPage() {
  const [status, setStatus] = useState('idle');
  const [log, setLog] = useState('');

  const handleTrigger = async () => {
    setStatus('running');
    setLog(`> [SYS] Init headless Chromium routine...\n> [SYS] Injecting headers...`);

    try {
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
        setLog(prev => prev + `\n> [OK] ${data.message}\n> [SYS] Connection terminated.`);
      } else {
        throw new Error(data.message || 'Process failed during execution.');
      }
    } catch (error) {
      setStatus('error');
      setLog(prev => prev + `\n> [ERR] ${error.message}\n> [SYS] Aborting.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto font-sans text-zinc-300">
      <div className="mb-10 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Fingerprint size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-100 tracking-tight">
              Daily Journal Injector
            </h1>
            <p className="text-zinc-400 text-sm mt-1 font-mono">
              Target: Google Forms / Chromium Automated Payload
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0f0f11] border border-zinc-800 rounded-2xl p-8">
            
            <div className="space-y-10">
              <div>
                <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                  <span className="text-emerald-500 font-mono text-sm">01 /</span> 
                  Dependencies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
                    <Network size={20} className="text-zinc-500" />
                    <div>
                      <div className="text-sm font-bold text-zinc-300">Node.js</div>
                      <div className="text-xs text-zinc-500 mt-1">v18.0.0+</div>
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
                    <Globe size={20} className="text-zinc-500" />
                    <div>
                      <div className="text-sm font-bold text-zinc-300">Chrome</div>
                      <div className="text-xs text-zinc-500 mt-1">Kill process</div>
                    </div>
                  </div>
                  <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
                    <HardDrive size={20} className="text-zinc-500" />
                    <div>
                      <div className="text-sm font-bold text-zinc-300">Git CLI</div>
                      <div className="text-xs text-zinc-500 mt-1">Required</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                  <span className="text-emerald-500 font-mono text-sm">02 /</span> 
                  Setup Routine
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="text-sm font-medium text-zinc-400 mb-2">Windows (CMD / PowerShell)</div>
                    <CodeSnippet code={`git clone https://github.com/VANSH-THAPAR/EasyLife.git\ncd EasyLife\nnpm install\nnpm run install-os`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-zinc-800 rounded-2xl bg-[#0f0f11] flex flex-col overflow-hidden sticky top-8">
            <div className="bg-zinc-900/50 border-b border-zinc-800 p-4 flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-2">
                <TerminalSquare size={14} /> terminal_out
              </span>
            </div>
            
            <div className="p-5 flex-1 min-h-[250px] max-h-[350px] overflow-y-auto font-mono text-xs leading-loose bg-[#0a0a0a]">
              <div className="text-zinc-600 mb-2">~ waiting for execution</div>
              {log && (
                <div className={`whitespace-pre-wrap ${status === 'error' ? 'text-red-400' : status === 'success' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                  {log}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-[#0f0f11]">
              <button 
                onClick={handleTrigger}
                disabled={status === 'running'}
                className="w-full bg-zinc-100 text-zinc-900 border border-transparent px-4 py-3 rounded-lg text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-700 flex justify-center items-center gap-2"
              >
                {status === 'running' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Compiling...
                  </>
                ) : (
                  <><Play size={16} fill="currentColor" /> Run Script</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
