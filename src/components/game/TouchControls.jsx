import React, { useState, useRef, useCallback } from 'react';

export default function TouchControls({ onInput }) {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const [aimPos, setAimPos] = useState({ x: 0, y: 0 });
  const [isAiming, setIsAiming] = useState(false);
  const [showAbilities, setShowAbilities] = useState(false);
  const joystickRef = useRef(null);
  const joystickCenter = useRef({ x: 0, y: 0 });
  const aimRef = useRef(null);
  const aimCenter = useRef({ x: 0, y: 0 });

  const handleJoystickStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    joystickCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    setIsJoystickActive(true);
    
    const dx = touch.clientX - joystickCenter.current.x;
    const dy = touch.clientY - joystickCenter.current.y;
    const maxDist = 40;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);
    
    setJoystickPos({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    });
    
    onInput('move', { x: dx / maxDist, y: dy / maxDist });
  }, [onInput]);

  const handleJoystickMove = useCallback((e) => {
    if (!isJoystickActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    
    const dx = touch.clientX - joystickCenter.current.x;
    const dy = touch.clientY - joystickCenter.current.y;
    const maxDist = 40;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);
    
    setJoystickPos({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    });
    
    onInput('move', { x: dx / maxDist, y: dy / maxDist });
  }, [isJoystickActive, onInput]);

  const handleJoystickEnd = useCallback((e) => {
    e.preventDefault();
    setIsJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    onInput('move', { x: 0, y: 0 });
  }, [onInput]);

  // Aim joystick for casting direction
  const handleAimStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = aimRef.current.getBoundingClientRect();
    aimCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    setIsAiming(true);
    
    const dx = touch.clientX - aimCenter.current.x;
    const dy = touch.clientY - aimCenter.current.y;
    const maxDist = 40;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);
    
    setAimPos({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    });
    
    const aimX = 400 + (dx / maxDist) * 400;
    const aimY = 300 + (dy / maxDist) * 300;
    onInput('aimX', aimX);
    onInput('aimY', aimY);
    onInput('cast', true);
  }, [onInput]);

  const handleAimMove = useCallback((e) => {
    if (!isAiming) return;
    e.preventDefault();
    const touch = e.touches[0];
    
    const dx = touch.clientX - aimCenter.current.x;
    const dy = touch.clientY - aimCenter.current.y;
    const maxDist = 40;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);
    
    setAimPos({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    });
    
    const aimX = 400 + (dx / maxDist) * 400;
    const aimY = 300 + (dy / maxDist) * 300;
    onInput('aimX', aimX);
    onInput('aimY', aimY);
  }, [isAiming, onInput]);

  const handleAimEnd = useCallback(() => {
    setIsAiming(false);
    setAimPos({ x: 0, y: 0 });
    onInput('cast', false);
  }, [onInput]);

  const handleButtonStart = useCallback((action) => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      onInput(action, true);
    };
  }, [onInput]);

  const handleButtonEnd = useCallback((action) => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      onInput(action, false);
    };
  }, [onInput]);

  // Ability buttons config
  const abilities = [
    { id: 'aoeBlast', icon: '💥', color: 'from-purple-500 to-purple-700', border: 'border-purple-400' },
    { id: 'reflectShield', icon: '🔮', color: 'from-blue-500 to-blue-700', border: 'border-blue-400' },
    { id: 'hover', icon: '🌀', color: 'from-cyan-500 to-cyan-700', border: 'border-cyan-400' },
    { id: 'timeSlow', icon: '⏱️', color: 'from-yellow-500 to-yellow-700', border: 'border-yellow-400' },
    { id: 'chainLightning', icon: '⚡', color: 'from-amber-400 to-amber-600', border: 'border-amber-300' },
    { id: 'shadowClone', icon: '👤', color: 'from-indigo-500 to-indigo-700', border: 'border-indigo-400' },
    { id: 'magneticPull', icon: '🧲', color: 'from-pink-500 to-pink-700', border: 'border-pink-400' },
    { id: 'teleport', icon: '✨', color: 'from-violet-500 to-violet-700', border: 'border-violet-400' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-30" style={{ height: '180px' }}>
      {/* Left side - Joystick */}
      <div
        ref={joystickRef}
        className="absolute left-3 bottom-3 w-28 h-28 rounded-full bg-slate-900/90 border-4 border-purple-500/70 pointer-events-auto shadow-xl shadow-purple-500/30"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
      >
        <div
          className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 border-2 border-white/40 shadow-lg"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`
          }}
        />
      </div>

      {/* Abilities toggle button - left side above joystick */}
      <button
        className={`absolute left-6 bottom-36 w-10 h-10 rounded-full pointer-events-auto flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all ${
          showAbilities 
            ? 'bg-gradient-to-br from-orange-500 to-red-600 border-2 border-orange-300' 
            : 'bg-gradient-to-br from-slate-600 to-slate-800 border-2 border-slate-500'
        }`}
        onTouchStart={(e) => {
          e.preventDefault();
          setShowAbilities(!showAbilities);
        }}
      >
        <span className="text-lg">{showAbilities ? '✕' : '⚡'}</span>
      </button>

      {/* Abilities wheel - shows when toggled */}
      {showAbilities && (
        <div className="absolute left-2 bottom-48 pointer-events-auto">
          <div className="grid grid-cols-4 gap-1.5">
            {abilities.map((ability) => (
              <button
                key={ability.id}
                className={`w-11 h-11 rounded-full bg-gradient-to-br ${ability.color} border-2 ${ability.border} flex items-center justify-center shadow-lg active:scale-90 active:brightness-125 transition-all`}
                onTouchStart={handleButtonStart(ability.id)}
                onTouchEnd={handleButtonEnd(ability.id)}
              >
                <span className="text-base">{ability.icon}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Right side - Action buttons */}
      <div className="absolute right-2 bottom-2 pointer-events-auto">
        {/* Main action - AIM & CAST */}
        <div
          ref={aimRef}
          className="absolute right-0 bottom-0 w-24 h-24 rounded-full bg-gradient-to-br from-purple-600/90 to-purple-800/90 border-4 border-purple-400/80 flex items-center justify-center shadow-xl shadow-purple-500/40"
          onTouchStart={handleAimStart}
          onTouchMove={handleAimMove}
          onTouchEnd={handleAimEnd}
        >
          <div
            className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 border-2 border-white/50 shadow-lg flex items-center justify-center"
            style={{
              transform: `translate(${aimPos.x}px, ${aimPos.y}px)`
            }}
          >
            <span className="text-xl">🔥</span>
          </div>
        </div>
        
        {/* JUMP */}
        <button
          className="absolute right-2 bottom-28 w-18 h-18 rounded-full bg-gradient-to-br from-green-500 to-green-700 border-3 border-green-400/80 flex items-center justify-center text-white font-bold shadow-xl shadow-green-500/40 active:scale-90 active:brightness-125 transition-all"
          style={{ width: '4.5rem', height: '4.5rem' }}
          onTouchStart={handleButtonStart('jump')}
          onTouchEnd={handleButtonEnd('jump')}
        >
          <span className="text-2xl">⬆</span>
        </button>
        
        {/* DASH */}
        <button
          className="absolute right-28 bottom-1 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 border-3 border-cyan-400/80 flex items-center justify-center text-white font-bold shadow-xl shadow-cyan-500/40 active:scale-90 active:brightness-125 transition-all"
          onTouchStart={handleButtonStart('dash')}
          onTouchEnd={handleButtonEnd('dash')}
        >
          <span className="text-xl">💨</span>
        </button>
        
        {/* SWITCH SPELL */}
        <button
          className="absolute right-28 bottom-20 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 border-2 border-indigo-400/80 flex items-center justify-center text-white text-xs font-bold shadow-xl shadow-indigo-500/40 active:scale-90 active:brightness-125 transition-all"
          onTouchStart={handleButtonStart('switch')}
          onTouchEnd={handleButtonEnd('switch')}
        >
          <span className="text-lg">🔄</span>
        </button>
      </div>
    </div>
  );
}