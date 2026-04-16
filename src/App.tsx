import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-dark-bg text-white font-mono flex flex-col relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-pink/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-white/5 relative z-10 bg-dark-bg/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse glow-green"></div>
          <h1 className="text-2xl font-bold tracking-widest text-white">
            NEON<span className="text-neon-green text-glow-green">SNAKE</span>
          </h1>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/50 uppercase tracking-widest mb-1">Score</span>
          <span className="text-3xl font-bold text-neon-pink text-glow-pink leading-none">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-8 relative z-10">
        {/* Left/Center: Game */}
        <div className="flex-1 flex justify-center items-center w-full max-w-2xl">
          <SnakeGame onScoreChange={setScore} />
        </div>

        {/* Right/Bottom: Music Player */}
        <div className="w-full lg:w-auto flex justify-center items-center">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
