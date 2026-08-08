import React, { useState, useEffect } from 'react';
import { NavTab, NetworkSpeed } from './types';
import { cachedNetworkImageService } from './services/cachedNetworkImageService';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { SanctuaryDashboard } from './components/SanctuaryDashboard';
import { JournalView } from './components/JournalView';
import { LibraryView } from './components/LibraryView';
import { InsightsView } from './components/InsightsView';
import { BoxBreathingModal } from './components/BoxBreathingModal';
import { GroundingModal } from './components/GroundingModal';
import { GratitudeJarModal } from './components/GratitudeJarModal';
import { LofiPlayerModal } from './components/LofiPlayerModal';
import { DigitalDestressModal } from './components/DigitalDestressModal';
import { FlutterDevInspector } from './components/FlutterDevInspector';
import { SettingsModal } from './components/SettingsModal';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';

const AVATAR_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuASfOjjAFtEIf9sEyuE7MRo9jah5Iq-WDIxsO0pYh2SHmF1sScgTFtWD0nkpx6IaowSkXzv4xew_Q82779Uqqz39-f1shaPvHYo_dlIFrTj6YN7ZKle4htoXnfLKcbtdgb7LF5TpoxOGMkfPpf889G9nV5P7lKQh3HiRsMO3yUUvVHjweZ9RIDN7d4l6oULYhhcLwoeYC_8YJ6vRhWW1FFc3N1H9Zem7YY8mFIbLJMifZEE-Db5AwwzMw';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('sanctuary');
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>(cachedNetworkImageService.getNetworkSpeed());
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [profileName, setProfileName] = useState<string>('Alex');

  // Modals
  const [isBoxBreathingOpen, setIsBoxBreathingOpen] = useState(false);
  const [isGroundingOpen, setIsGroundingOpen] = useState(false);
  const [isGratitudeJarOpen, setIsGratitudeJarOpen] = useState(false);
  const [isLofiPlayerOpen, setIsLofiPlayerOpen] = useState(false);
  const [isDigitalDestressOpen, setIsDigitalDestressOpen] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const unsub = cachedNetworkImageService.subscribe(() => {
      setNetworkSpeed(cachedNetworkImageService.getNetworkSpeed());
    });
    return unsub;
  }, []);

  const handleNetworkSpeedChange = (speed: NetworkSpeed) => {
    setNetworkSpeed(speed);
    cachedNetworkImageService.setNetworkSpeed(speed);
  };

  return (
    <MobileDeviceFrame isMobileFrame={isMobileFrame}>
      <div className="blob-bg" />

      {/* Top Header App Bar */}
      <TopAppBar
        networkSpeed={networkSpeed}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDevTools={() => setIsDevToolsOpen(true)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        profileAvatarUrl={AVATAR_IMG}
      />

      {/* Desktop View Header Nav (hidden on mobile) */}
      {!isMobileFrame && (
        <header className="hidden md:flex justify-between items-center px-8 py-3 max-w-[1100px] mx-auto text-sm border-b border-slate-200 mb-2">
          <div className="flex gap-2 items-center">
            {(['sanctuary', 'journal', 'library', 'insights'] as NavTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>
      )}

      {/* Main Viewport Content */}
      <main className="max-w-[1100px] mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-28">
        {activeTab === 'sanctuary' && (
          <SanctuaryDashboard
            onOpenBoxBreathing={() => setIsBoxBreathingOpen(true)}
            onOpenGrounding={() => setIsGroundingOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'journal' && <JournalView />}

        {activeTab === 'library' && (
          <LibraryView
            onOpenBoxBreathing={() => setIsBoxBreathingOpen(true)}
            onOpenGratitudeJar={() => setIsGratitudeJarOpen(true)}
            onOpenLofiPlayer={() => setIsLofiPlayerOpen(true)}
            onOpenDigitalDestress={() => setIsDigitalDestressOpen(true)}
          />
        )}

        {activeTab === 'insights' && <InsightsView />}
      </main>

      {/* Bottom Pill Navigation */}
      <BottomNavBar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Modals & Overlays */}
      {isBoxBreathingOpen && <BoxBreathingModal onClose={() => setIsBoxBreathingOpen(false)} />}
      {isGroundingOpen && <GroundingModal onClose={() => setIsGroundingOpen(false)} />}
      {isGratitudeJarOpen && <GratitudeJarModal onClose={() => setIsGratitudeJarOpen(false)} />}
      {isLofiPlayerOpen && <LofiPlayerModal onClose={() => setIsLofiPlayerOpen(false)} />}
      {isDigitalDestressOpen && <DigitalDestressModal onClose={() => setIsDigitalDestressOpen(false)} />}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          profileName={profileName}
          onUpdateProfileName={setProfileName}
        />
      )}

      {/* Senior Flutter DevTools & SQFlite Inspector */}
      <FlutterDevInspector
        isOpen={isDevToolsOpen}
        onClose={() => setIsDevToolsOpen(false)}
        networkSpeed={networkSpeed}
        onNetworkSpeedChange={handleNetworkSpeedChange}
      />
    </MobileDeviceFrame>
  );
}
