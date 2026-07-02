import React, { useState, useRef } from 'react';
import { Maximize2, Minimize2, RotateCw, ExternalLink, Gamepad2, ShieldAlert } from 'lucide-react';

export default function GamesEmbed() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Keep state sync in case user exits fullscreen via ESC key
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleOpenNewTab = () => {
    window.open('https://zenith.helium-on.top', '_blank');
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full flex flex-col rounded-[2.5rem] bg-imm-sidebar border border-imm-border overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'h-screen rounded-none border-none' : 'h-[calc(100vh-140px)] min-h-[600px]'
      }`}
    >
      {/* Immersive Game Bar Control Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-imm-border backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-imm-accent/10 rounded-xl border border-imm-accent/20">
            <Gamepad2 className="w-5 h-5 text-imm-accent animate-pulse" />
          </div>
          <div>
            <h3 className="serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Zenith Arcade
            </h3>
            <p className="text-[10px] text-imm-text/40 font-mono tracking-wider">zenith.helium-on.top</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Reload Control */}
          <button
            onClick={handleReload}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-imm-text/60 hover:text-white rounded-xl border border-imm-border/50 hover:border-imm-accent/30 transition-all cursor-pointer flex items-center justify-center"
            title="Reload Frame"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Open in New Tab Control */}
          <button
            onClick={handleOpenNewTab}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-imm-text/60 hover:text-white rounded-xl border border-imm-border/50 hover:border-imm-accent/30 transition-all cursor-pointer flex items-center justify-center"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Fullscreen Control */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-imm-accent/10 hover:bg-imm-accent/20 text-imm-accent rounded-xl border border-imm-accent/30 hover:border-imm-accent/50 transition-all cursor-pointer flex items-center justify-center font-bold"
            title={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Embedded Iframe Container */}
      <div className="flex-1 w-full bg-black/80 relative">
        <iframe
          ref={iframeRef}
          src="https://zenith.helium-on.top"
          className="w-full h-full border-0"
          title="Zenith Games Portal"
          allow="autoplay; gamepad; keyboard; fullscreen"
          referrerPolicy="no-referrer"
        />
        
        {/* Subtle decorative bottom bezel border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-imm-accent/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
