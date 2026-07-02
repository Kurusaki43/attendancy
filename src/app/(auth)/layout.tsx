import type { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 transition-colors dark:bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Primary glow */}
        <div className="absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-[140px] dark:bg-violet-600/25" />

        {/* Secondary glow */}
        <div className="absolute top-1/4 left-1/3 h-75 w-75 rounded-full bg-cyan-400/15 blur-[120px] dark:bg-cyan-500/20" />

        {/* Accent glow */}
        <div className="absolute right-1/4 bottom-0 h-100 w-100 rounded-full bg-fuchsia-400/15 blur-[140px] dark:bg-fuchsia-500/20" />

        {/* Theme overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.9)_85%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#020617_85%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md items-center justify-center">
        {children}
      </div>
    </main>
  );
};

export default Layout;
