import { useState } from 'react';
import { AuditForm } from './components/AuditForm';
import { AuditList } from './components/AuditList';
import { LandingPage } from './components/LandingPage';
import { api } from './services/api';
import { BackgroundLines } from './components/BackgroundLines';
import { Squares } from './components/Squares';
import { HomeIcon, PlusIcon, DashboardIcon, MailIcon } from './components/Icons';
import { ReportEmailForm } from './components/ReportEmailForm';

function App() {
  const [jobIds, setJobIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'new' | 'history' | 'email'>('home');

  const handleStartAudit = async (urls: string[], enableAi: boolean) => {
    setIsLoading(true);
    setActiveTab('history');

    for (const url of urls) {
      try {
        const id = await api.startAudit([url], enableAi);
        setJobIds(prev => [id, ...prev]);
      } catch (error) {
        console.error(`Failed to start audit for ${url}:`, error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full bg-earth-bg text-earth-dark font-sans overflow-hidden selection:bg-earth-primary/30 selection:text-earth-dark">

      <aside className="w-64 flex-shrink-0 bg-white/20 backdrop-blur-xl border-r border-[#9DB68B]/30 flex flex-col">
        <div className="p-6 border-b border-[#9DB68B]/30 flex items-center gap-4">
          <img src="/logo-aria.png" alt="Aria Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold tracking-tighter text-3xl text-[#2C3E50] font-serif leading-none">ARIA</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'home' ? 'bg-[#9DB68B] text-white shadow-md' : 'text-[#5D6D7E] hover:bg-[#9DB68B]/20 hover:text-[#2C3E50]'}`}
          >
            <HomeIcon className={`w-5 h-5 transition-colors ${activeTab === 'home' ? 'text-white' : 'group-hover:text-[#9DB68B]'}`} />
            <span className="font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'new' ? 'bg-[#9DB68B] text-white shadow-md' : 'text-[#5D6D7E] hover:bg-[#9DB68B]/20 hover:text-[#2C3E50]'}`}
          >
            <PlusIcon className={`w-5 h-5 transition-colors ${activeTab === 'new' ? 'text-white' : 'group-hover:text-[#9DB68B]'}`} />
            <span className="font-medium">New Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'history' ? 'bg-[#9DB68B] text-white shadow-md' : 'text-[#5D6D7E] hover:bg-[#9DB68B]/20 hover:text-[#2C3E50]'}`}
          >
            <DashboardIcon className={`w-5 h-5 transition-colors ${activeTab === 'history' ? 'text-white' : 'group-hover:text-[#9DB68B]'}`} />
            <span className="font-medium">Dashboard</span>
            {jobIds.length > 0 && <span className="ml-auto bg-white/30 text-xs px-2 py-0.5 rounded-full text-[#2C3E50]">{jobIds.length}</span>}
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'email' ? 'bg-[#9DB68B] text-white shadow-md' : 'text-[#5D6D7E] hover:bg-[#9DB68B]/20 hover:text-[#2C3E50]'}`}
          >
            <MailIcon className={`w-5 h-5 transition-colors ${activeTab === 'email' ? 'text-white' : 'group-hover:text-[#9DB68B]'}`} />
            <span className="font-medium">File Claim</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#9DB68B]/30">
          <div className="text-xs text-[#5D6D7E] text-center">v1.2.0 • Stable</div>
        </div>
      </aside>

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 z-0">
          {activeTab === 'home' ? (
            <BackgroundLines
              className="pointer-events-none"
            />
          ) : (
            <Squares
              direction="up"
              speed={0.5}
              squareSize={50}
              borderColor="#D4C5B0"
              hoverFillColor="#9DB68B"
            />
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-thin scrollbar-thumb-[#9DB68B]/50 scrollbar-track-transparent">
          <div className="w-full px-6">

            {activeTab !== 'home' && (
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#2C3E50] mb-2 font-serif">
                  {activeTab === 'new' ? 'Initialize Audit' : activeTab === 'email' ? 'File Official Claim' : 'Audit Dashboard'}
                </h1>
                <p className="text-[#5D6D7E]">
                  {activeTab === 'new'
                    ? 'Enter targets for automated compliance verification.'
                    : activeTab === 'email'
                    ? 'Submit formal notifications to enforcement agencies.'
                    : 'Real-time status tracking and report generation.'}
                </p>
              </header>
            )}

            <div className={`transition-all duration-500 ${activeTab === 'home' ? 'opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'}`}>
              <LandingPage onGetStarted={() => setActiveTab('new')} />
            </div>

            <div className={`transition-all duration-500 ${activeTab === 'new' ? 'opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'}`}>
              <AuditForm onAuditStart={handleStartAudit} isLoading={isLoading} />
            </div>

            <div className={`transition-all duration-500 ${activeTab === 'history' ? 'opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'}`}>
              <AuditList jobs={jobIds} />
            </div>

            <div className={`transition-all duration-500 ${activeTab === 'email' ? 'opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'}`}>
              <ReportEmailForm sessionJobIds={jobIds} />
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

export default App;
