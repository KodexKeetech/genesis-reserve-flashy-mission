import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Play, ShoppingBag, Zap, Sparkles, Gem, FolderOpen, Map, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import cloudSaveManager from '@/components/game/CloudSaveManager';

export default function Home() {
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [magicScraps, setMagicScraps] = useState(0);
  const [arcaneCrystals, setArcaneCrystals] = useState(0);
  const [highestLevel, setHighestLevel] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cloudSynced, setCloudSynced] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      // Try to load from cloud first
      const cloudProgress = await cloudSaveManager.loadProgress();
      
      if (cloudProgress) {
        setMagicScraps(cloudProgress.magicScraps || 0);
        setArcaneCrystals(cloudProgress.arcaneCrystals || 0);
        setHighestLevel(cloudProgress.highestLevel || 1);
        setHasSavedGame(cloudProgress.currentLevel > 1);
        setCloudSynced(true);
      } else {
        // Fallback to localStorage
        const localData = localStorage.getItem('hash_player_data');
        if (localData) {
          const data = JSON.parse(localData);
          setMagicScraps(data.magicScraps || 0);
          setArcaneCrystals(data.arcaneCrystals || 0);
          setHighestLevel(data.highestLevel || 1);
        }
        const saved = localStorage.getItem('hash_save_game');
        setHasSavedGame(!!saved);
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



      {/* Cover Art - Behind everything */}
      <div className="fixed inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <motion.img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696532152ae03346493429c1/01a524e3d_logo.png"
          alt="Portal to Nodehaven"
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

      {/* Main Content - Title and stats at top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full flex flex-col items-center justify-center"
      >
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 mb-2">
          PORTAL TO NODEHAVEN
        </h1>
        <p className="text-xl md:text-2xl font-bold text-cyan-400 mb-1">Hash's Quest</p>
        <p className="text-slate-500 mb-4 md:mb-6 text-sm md:text-base">Collect Data Coins & Defeat the Hackers</p>

        {/* Stats Row */}
        <div className="flex justify-center gap-3 mb-4">
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
      </motion.div>

      {/* Layout Container - Image in center, buttons on right */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-4 md:px-12 gap-8">
        {/* Left spacer for image */}
        <div className="flex-1" />

        {/* Right sidebar with buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-2 w-48"
        >
          <Link to={createPageUrl('Game')}>
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-4 py-2 text-sm rounded-lg shadow-lg shadow-purple-500/30"
            >
              <Play className="w-4 h-4 mr-2" />
              Play Game
            </Button>
          </Link>
          
          {hasSavedGame && (
            <Link to={createPageUrl('Game') + '?continue=true'}>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 font-bold px-4 py-2 text-xs rounded-lg"
              >
                <FolderOpen className="w-3 h-3 mr-2" />
                Continue
              </Button>
            </Link>
          )}
          
          <Link to={createPageUrl('LevelSelect')}>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/20 font-bold px-4 py-2 text-xs rounded-lg"
            >
              <Map className="w-3 h-3 mr-2" />
              Level Select
            </Button>
          </Link>

          {/* Shop Buttons */}
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-700">
            <Link to={createPageUrl('UpgradeShop')}>
              <Button size="sm" className="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 text-xs">
                <ShoppingBag className="w-3 h-3 mr-1" />
                Upgrades
              </Button>
            </Link>
            <Link to={createPageUrl('AbilityShop')}>
              <Button size="sm" className="w-full bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-500 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Abilities
              </Button>
            </Link>
          </div>

          {/* Cloud sync indicator */}
          {cloudSynced && (
            <div className="mt-2 pt-2 border-t border-slate-700 flex items-center gap-1 text-green-400 text-xs justify-center">
              <Cloud className="w-3 h-3" />
              <span>Cloud Save</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Controls hint - bottom center */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-slate-500 text-xs md:text-sm space-y-1 text-center z-10">
        <p>← → Move | SPACE Jump | CLICK Cast</p>
        <p>SHIFT Dash | Q Switch Spell</p>
      </div>
    </div>
  );
}