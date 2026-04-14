import { useState } from 'react';
import { Play, SquareTerminal, HardDrive, Network, Globe, Copy, Check } from 'lucide-react';

const CodeSnippet = ({ code, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group border border-[#333] bg-[#050505] ${className}`}>
      <div className="flex justify-between items-center px-4 py-2 border-b border-[#222] bg-[#0a0a0a]">
        <span className="text-[10px] uppercase text-neutral-500 tracking-widest">bash</span>
        <button 
          onClick={handleCopy}
          className="text-neutral-500 hover:text-orange-500 transition-colors flex items-center gap-1 text-[10px] uppercase tracking-widest"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <pre className="text-orange-400 p-4 overflow-x-auto text-[11px] leading-relaxed">
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
    setLog(`[SYS] EXECUTING HEADLESS INJECTION...`);

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
        setLog(`[OK] PAYLOAD DELIVERED. RES: ${data.message}`);
      } else {
        throw new Error(data.message || 'PROCESS FAILED');
      }
    } catch (error) {
      setStatus('error');
      setLog(`[ERR] ${error.message.toUpperCase()}`);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-mono text-neutral-300">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
          <SquareTerminal className="text-orange-500" size={24} />
          Daily_Journal.sh
        </h1>
        <p className="text-neutral-500 text-xs tracking-wide">
          // AUTONOMOUS CHROMIUM INSTANCE :: FORM INJECTION MODULE
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="border border-[#222] bg-[#050505] p-6 relative">
            <div className="absolute top-0 left-0 bg-orange-500 text-black text-[9px] px-2 font-bold tracking-widest">DOCS</div>
            
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-xs text-orange-500 mb-3 tracking-widest flex items-center gap-2">
                  <span className="text-neutral-600">01 /</span> REQUISITES
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-[#111] bg-[#0a0a0a] p-3">
                    <Network size={14} className="text-neutral-500 mb-2" />
                    <div className="text-xs text-white">Node.js</div>
                    <div className="text-[10px] text-neutral-600">v18.0.0+</div>
                  </div>
                  <div className="border border-[#111] bg-[#0a0a0a] p-3">
                    <Globe size={14} className="text-neutral-500 mb-2" />
                    <div className="text-xs text-white">Chrome</div>
                    <div className="text-[10px] text-neutral-600">Terminate bounds</div>
                  </div>
                  <div className="border border-[#111] bg-[#0a0a0a] p-3">
                    <HardDrive size={14} className="text-neutral-500 mb-2" />
                    <div className="text-xs text-white">Git</div>
                    <div className="text-[10px] text-neutral-600">Source control</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs text-orange-500 mb-3 tracking-widest flex items-center gap-2">
                  <span className="text-neutral-600">02 /</span> DEPLOYMENT
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-neutral-400 mb-2">TARGET: WINDOWS/CMD</div>
                    <CodeSnippet code={`git clone https://github.com/VANSH-THAPAR/EasyLife.git\ncd EasyLife\nnpm install\nnpm run install-os`} />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 mb-2">TARGET: UNIX/ZSH</div>
                    <CodeSnippet code={`git clone https://github.com/VANSH-THAPAR/EasyLife.git\ncd EasyLife\nnpm install\nnpm run install-os`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-[#222] bg-[#0a0a0a] flex flex-col h-full sticky top-8">
            <div className="bg-[#111] border-b border-[#222] p-3 flex justify-between items-center">
              <span className="text-[10px] uppercase text-orange-500 tracking-widest font-bold">Terminal_Output</span>
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            </div>
            
            <div className="p-4 flex-1 h-[200px] overflow-y-auto bg-black text-[11px] leading-loose">
              <div className="text-neutral-600 mb-2">&gt; AWAITING CMD...</div>
              {log && (
                <div className={status === 'error' ? 'text-red-500' : 'text-orange-400'}>
                  <span className="mr-2 text-neutral-600">&gt;</span>{log}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#222] bg-[#050505]">
              <button 
                onClick={handleTrigger}
                disabled={status === 'running'}
                className="w-full bg-orange-500 text-black px-4 py-3 text-xs font-bold hover:bg-orange-400 disabled:opacity-50 disabled:bg-[#333] disabled:text-neutral-500 uppercase tracking-widest flex justify-center items-center gap-2 transition-colors active:scale-95"
              >
                {status === 'running' ? (
                  <>PROCESSING...</>
                ) : (
                  <><Play size={14} fill="currentColor" /> EXECUTE</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
