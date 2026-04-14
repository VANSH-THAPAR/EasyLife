import { Link } from 'react-router-dom';
import { Terminal, Activity, FileCode, Server, Shield } from 'lucide-react';

const tasks = [
  { 
    id: 'daily-journal', 
    title: 'DAILY_JOURNAL_UPLINK', 
    description: 'Execute EOD auto-form payload. Bypasses standard bot detection via local cookie injection.', 
    href: '/daily-journal', 
    icon: <Terminal size={24} className="text-orange-500" />,
    status: 'SYS.ACTIVE'
  },
  { 
    id: 'weekly-report', 
    title: 'WEEKLY_REPORT_GEN', 
    description: 'Aggregate Git commits & Jira tickets into raw Markdown manifest.', 
    href: '#', 
    icon: <FileCode size={24} className="text-neutral-600" />, 
    status: 'OFFLINE' 
  },
  { 
    id: 'health-check', 
    title: 'INFRA_HEALTH_PING', 
    description: 'Continuous diagnostic ping loop across personal subnets.', 
    href: '#', 
    icon: <Activity size={24} className="text-neutral-600" />, 
    status: 'OFFLINE'
  },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto font-mono text-neutral-300">
      <div className="mb-12 border-b border-[#333] pb-6">
        <div className="flex items-center gap-3 mb-2 opacity-70">
          <Server size={16} className="text-orange-500" />
          <span className="text-xs tracking-[0.2em] text-orange-500">ROOT_ACCESS_GRANTED</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-4">
          System Overview
        </h1>
        <p className="text-neutral-500 text-sm mt-4 border-l-2 border-orange-500 pl-3">
          > SELECT_MODULE(...) <br/>
          > ENVIRONMENT: LOCAL / AUTH: VERIFIED
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">    
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group relative bg-[#050505] border border-[#222] p-6 hover:border-orange-500/50 transition-all flex flex-col justify-between min-h-[240px]"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500/0 group-hover:border-orange-500/80 transition-all"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-orange-500/0 group-hover:border-orange-500/80 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange-500/0 group-hover:border-orange-500/80 transition-all"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500/0 group-hover:border-orange-500/80 transition-all"></div>

            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 border border-[#222] bg-[#0a0a0a]">
                  {task.icon}
                </div>
                <span className={`text-[10px] tracking-widest px-2 py-1 border ${task.status === 'SYS.ACTIVE' ? 'text-orange-500 border-orange-500/30 bg-orange-500/10' : 'text-neutral-600 border-[#222] bg-[#111]'}`}>
                  [{task.status}]
                </span>
              </div>
              <h2 className="text-lg font-bold mb-2 text-neutral-200 group-hover:text-orange-400 transition-colors uppercase tracking-widest">{task.title}</h2>
              <p className="text-neutral-500 text-xs leading-relaxed">{task.description}</p>
            </div>

            <div className="mt-6">
              {task.status === 'SYS.ACTIVE' ? (
                <Link
                  to={task.href}
                  className="flex items-center justify-between w-full bg-[#111] text-white border border-[#333] px-4 py-2 text-xs hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  Init_Sequence()
                  <span className="font-bold">→</span>
                </Link>
              ) : (
                <button disabled className="w-full bg-[#0a0a0a] text-neutral-700 border border-[#1a1a1a] px-4 py-2 text-xs cursor-not-allowed uppercase tracking-widest text-left">  
                  ERR_UNAVAILABLE
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
