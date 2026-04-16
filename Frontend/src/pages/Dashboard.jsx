import { Link } from 'react-router-dom';
import { Terminal, GitMerge, Activity, ArrowRight, Command } from 'lucide-react';

const tasks = [
  { 
    id: 'daily-journal', 
    title: 'Daily Journal Agent', 
    description: 'Automate EOD workflow. Bypasses captchas with secure localized profile mapping.', 
    href: '/daily-journal', 
    icon: <Terminal size={24} className="text-emerald-400" />,
    status: 'Active',
    active: true
  },
  { 
    id: 'weekly-report', 
    title: 'Sprint Compiler', 
    description: 'Aggregates version control commits and issues to generate manager-ready summaries.', 
    href: '#', 
    icon: <GitMerge size={24} className="text-zinc-500" />, 
    status: 'Offline',
    active: false
  },
  { 
    id: 'health-check', 
    title: 'Network Pulse', 
    description: 'Continuous diagnostic telemetry across infrastructure domains. Real-time alerting.', 
    href: '#', 
    icon: <Activity size={24} className="text-zinc-500" />, 
    status: 'Offline',
    active: false
  },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-400 mb-6">
          <Command size={14} />
          <span>INITIALIZED</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-zinc-100 mb-4">
          Workspace <span className="text-zinc-600">/</span> Overview
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Select a registered automation module. Environment variables mapped and injected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">    
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`group relative bg-[#0f0f11] border rounded-2xl p-7 flex flex-col justify-between min-h-[260px] transition-all duration-300 ${task.active ? 'border-zinc-800 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-zinc-800/50 opacity-70'}`}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className={`p-3 rounded-xl border ${task.active ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-900 border-zinc-800'}`}>
                  {task.icon}
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded border ${task.active ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-zinc-500 border-zinc-800 bg-zinc-900'}`}>
                  {task.status}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-3 text-zinc-100">{task.title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{task.description}</p>
            </div>

            <div className="mt-8">
              {task.active ? (
                <Link
                  to={task.href}
                  className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-zinc-950 px-4 py-3 rounded-lg text-sm font-bold hover:bg-emerald-400 transition-colors"
                >
                  Execute Module
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <button disabled className="w-full bg-zinc-900 text-zinc-600 border border-zinc-800 px-4 py-3 rounded-lg text-sm font-bold cursor-not-allowed text-center">  
                  Unavailable
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
