import { Link, useLocation } from 'react-router-dom';
import { Hexagon, LayoutDashboard, TerminalSquare } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Daily Journal', path: '/daily-journal', icon: <TerminalSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Floating Horizontal Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-6xl bg-[#0f0f11]/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Hexagon size={22} fill="currentColor" fillOpacity={0.2} />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="leading-none text-zinc-100 font-bold text-lg">EasyLife</span>
            <span className="text-[10px] text-emerald-500 font-mono tracking-[0.2em] mt-1 uppercase">v3.0.Core</span>
          </div>
        </Link>

        {/* Center Nav Items */}
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-zinc-500'}>{item.icon}</span>
                <span className="hidden md:inline-block">{item.name}</span>
              </Link>
            )
          })}
        </nav>
        
        {/* Right Status */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800/50 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-zinc-400 tracking-wider font-mono">SYS_OPT</span>
          </div>
          <span className="text-xs text-emerald-500/70 font-mono">12ms</span>
        </div>
      </header>

      {/* Main Content Area - Added padding-top to ensure it's not hidden behind the floating nav */}
      <main className="relative z-10 p-6 pt-32 lg:p-12 lg:pt-36">
        {children}
      </main>
    </div>
  );
}
