import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function ComicAdOverlay({ onAdComplete, onSkipAd }) {
  const [timeLeft, setTimeLeft] = useState(10);
  const comicUrl = "https://globalcomix.com/c/jefftherobotwizard";
  const comicImage = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/754fd52f9_1117_00000_00000.jpg";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onAdComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAdComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-4"
    >
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl shadow-2xl p-8 max-w-2xl w-full text-center border-2 border-purple-500">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-6 tracking-tight">
          READ THE LORE COMIC HERE
        </h2>
        <img 
          src={comicImage} 
          alt="Jeff The Robot Wizard Comic" 
          className="w-full h-auto rounded-lg mb-6 object-cover border-2 border-purple-600 shadow-lg" 
        />
        <p className="text-slate-200 text-lg leading-relaxed mb-8">
          AI destroyed humanity, but magic returned. Robot wizard Jeff journeys through portals to mythical realms where reality bends and existence transforms.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => window.open(comicUrl, '_blank')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Read the Comic Now!
          </Button>
          <Button
            onClick={onSkipAd}
            disabled={timeLeft > 0}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {timeLeft > 0 ? `Continue in ${timeLeft}s` : 'Continue Game'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}