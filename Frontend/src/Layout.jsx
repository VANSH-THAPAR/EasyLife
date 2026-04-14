import { Link, useLocation } from 'react-router-dom';
import { Cpu, TerminalSquare } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: 'DASHBOARD.EXE', path: '/', icon: <Cpu size={16} /> },
    { name: 'JOURNAL_BOT.SH', path: '/daily-journal', icon: <TerminalSquare size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#000] text-neutral-300 font-mono selection:bg-orange-500/30 selection:text-orange-200 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <aside className="w-64 fixed inset-y-0 left-0 bg-[#050505] border-r border-[#222] flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div className="p-6 border-b border-[#222]">
          <Link to="/" className="text-xl font-bold tracking-tighter flex items-center gap-3 text-white hover:text-orange-500 transition-colors">
            <div className="w-8 h-8 flex items-center justify-center border border-orange-500/50 bg-orange-500/10 text-orange-500">
              <Cpu size={18} />
            </div>
            <div className="flex flex-col">
              <span className="leading-none uppercase tracking-widest">EASY<span className="text-orange-500">LIFE</span></span>
              <span className="text-[9px] text-neutral-600 tracking-[0.2em] mt-1">SYS_VER 1.0</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          <div className="text-[10px] text-neutral-600 uppercase tracking-widest px-2 mb-4">
            // MODULES
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 text-xs transition-all duration-200 uppercase tracking-widest ${
                  isActive
                    ? 'bg-[#111] text-orange-500 border-l-2 border-orange-500'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#111] border-l-2 border-transparent'
                }`}
              >
                <span className={`opacity-80`}>{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-[#222] bg-[#020202]">
          <div className="text-[10px] text-neutral-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-500 animate-pulse"></span>
              <span className="tracking-widest">NODE : ONLINE</span>
            </div>
            <span className="text-neutral-700">0ms</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen relative z-10">
        {children}
      </main>
    </div>
  );
}
