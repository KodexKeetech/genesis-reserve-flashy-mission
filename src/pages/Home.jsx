import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Play, ShoppingBag, Zap, Sparkles, Gem, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function Home() {
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [magicScraps, setMagicScraps] = useState(0);
  const [arcaneCrystals, setArcaneCrystals] = useState(0);
  const [highestLevel, setHighestLevel] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('jeff_save_game');
    setHasSavedGame(!!saved);

    const loadUserData = async () => {
      try {
        const user = await base44.auth.me();
        setMagicScraps(user.magicScraps || 0);
        setArcaneCrystals(user.arcaneCrystals || 0);
        setHighestLevel(user.highestLevel || 1);
      } catch (e) {
        // Not logged in
      }
    };
    loadUserData();

    // Mouse tracking for parallax (desktop only)
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden overflow-x-hidden">
      {/* Space Background */}
      <div className="fixed inset-0 bg-black overflow-hidden pointer-events-none">
        {/* Stars - static, no parallax */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: (i % 3) + 1 + 'px',
                height: (i % 3) + 1 + 'px',
                top: ((i * 37) % 100) + '%',
                left: ((i * 73) % 100) + '%',
                opacity: 0.3 + (i % 5) * 0.15,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: (i % 20) * 0.1 + 's'
              }}
            />
          ))}
          {/* Larger stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`big-${i}`}
              className="absolute rounded-full"
              style={{
                width: 2 + (i % 3) + 'px',
                height: 2 + (i % 3) + 'px',
                top: ((i * 53) % 100) + '%',
                left: ((i * 41) % 100) + '%',
                backgroundColor: ['#fff', '#A5F3FC', '#C4B5FD', '#FDE68A'][i % 4],
                boxShadow: '0 0 6px currentColor',
                animation: `twinkle ${3 + (i % 4)}s ease-in-out infinite`
              }}
            />
          ))}
        </div>
        {/* Planets - with parallax */}
        <div 
          className="absolute top-[15%] right-[10%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-600 via-purple-800 to-purple-950 opacity-60 shadow-lg shadow-purple-500/20 transition-transform duration-200 ease-out"
          style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
        />
        <div 
          className="absolute bottom-[20%] left-[8%] w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-blue-900 opacity-50 shadow-lg shadow-blue-500/20 transition-transform duration-200 ease-out"
          style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
        />
        <div 
          className="absolute top-[60%] right-[20%] w-6 h-6 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-700 opacity-40 transition-transform duration-200 ease-out"
          style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
        />
        {/* Nebula glow - with parallax */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl transition-transform duration-300 ease-out"
          style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl transition-transform duration-300 ease-out"
          style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}
        />
      </div>
      
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Comic Links - Top Left */}
      <div className="fixed top-3 left-3 z-20 flex flex-col gap-2">
        <a 
          href="https://globalcomix.com/a/jeff-the-robot-wizard" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white text-xs px-3 py-2 rounded-lg border border-purple-500/50 hover:border-purple-400 transition-all flex items-center gap-2"
        >
          <span>📖</span>
          <span>Read the Comic</span>
        </a>
        <a 
          href="https://linktr.ee/JeffTheRobotWizard" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white text-xs px-3 py-2 rounded-lg border border-cyan-500/50 hover:border-cyan-400 transition-all flex items-center gap-2"
        >
          <span>🔗</span>
          <span>Socials</span>
        </a>
      </div>

      {/* Support Banner - Top Right */}
      <a 
        href="https://globalcomix.com/a/jeff-the-robot-wizard" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed top-3 right-3 z-20 bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm hover:from-purple-500 hover:to-blue-500 text-white text-xs md:text-sm px-4 py-2.5 rounded-lg border border-purple-400/50 hover:border-purple-300 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
      >
        <span>📖</span>
        <span className="font-semibold">Read our Comic to Support the Game!</span>
      </a>

      {/* Cover Art - Behind everything */}
      <div className="fixed inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <motion.img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/e1f8515a1_artworks_00005.png"
          alt="Jeff the Robot Wizard"
          className="w-[80vw] h-[80vh] md:w-[70vw] md:h-[85vh] object-contain opacity-30 drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.3, scale: 1, y: [0, -15, 0] }}
          transition={{ 
            opacity: { duration: 1 },
            scale: { duration: 1 },
            y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-slate-400 mb-2">
          JEFF
        </h1>
        <p className="text-xl md:text-2xl font-bold text-slate-400 mb-1">The Robot Wizard</p>
        <p className="text-slate-500 mb-6 md:mb-8 text-sm md:text-base">A Magical Platformer Adventure</p>

        {/* Stats Row */}
        <div className="flex justify-center gap-3 mb-6 md:mb-8">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-500/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-bold text-sm">{magicScraps}</span>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-indigo-500/30 flex items-center gap-2">
            <Gem className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 font-bold text-sm">{arcaneCrystals}</span>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-500/30 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 font-bold text-sm">Lv {highestLevel}</span>
          </div>
        </div>
        
        {/* Main Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <Link to={createPageUrl('Game')}>
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-8 py-6 text-lg md:text-xl rounded-xl shadow-lg shadow-purple-500/30"
            >
              <Play className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              Play Game
            </Button>
          </Link>
          
          {hasSavedGame && (
            <Link to={createPageUrl('Game') + '?continue=true'}>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 font-bold px-8 py-4 text-base md:text-lg rounded-xl"
              >
                <FolderOpen className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Continue (Level {JSON.parse(localStorage.getItem('jeff_save_game') || '{}').level || 1})
              </Button>
            </Link>
          )}
        </div>

        {/* Shop Buttons */}
        <div className="flex gap-3 justify-center">
          <Link to={createPageUrl('UpgradeShop')}>
            <Button className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 text-sm md:text-base">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Upgrades
            </Button>
          </Link>
          <Link to={createPageUrl('AbilityShop')}>
            <Button className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-500 text-sm md:text-base">
              <Zap className="w-4 h-4 mr-2" />
              Abilities
            </Button>
          </Link>
        </div>

        {/* Controls hint */}
        <div className="mt-8 text-slate-500 text-xs md:text-sm space-y-1">
          <p>← → Move | SPACE Jump | CLICK Cast</p>
          <p>SHIFT Dash | Q Switch Spell</p>
        </div>
      </motion.div>
    </div>
  );
}