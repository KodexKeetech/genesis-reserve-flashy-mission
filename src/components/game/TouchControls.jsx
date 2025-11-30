import React, { useState, useRef, useCallback } from 'react';

export default function TouchControls({ onInput }) {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const [aimPos, setAimPos] = useState({ x: 0, y: 0 });
  const [isAiming, setIsAiming] = useState(false);
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
    const maxDist = 35;
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
    const maxDist = 35;
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

  const handleJoystickCancel = useCallback((e) => {
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
    const maxDist = 35;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);
    
    setAimPos({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    });
    
    // Convert to game canvas coordinates (approximate center of screen + offset)
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
    const maxDist = 35;
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

  const handleButtonStart = useCallback((action) => (e) => {
    e.preventDefault();
    onInput(action, true);
  }, [onInput]);

  const handleButtonEnd = useCallback((action) => (e) => {
    e.preventDefault();
    onInput(action, false);
  }, [onInput]);

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50 md:hidden" style={{ height: '35vh' }}>
      {/* Left side - Joystick */}
      <div
        ref={joystickRef}
        className="absolute left-4 bottom-4 w-24 h-24 rounded-full bg-slate-900/80 border-3 border-purple-500/60 pointer-events-auto shadow-lg shadow-purple-500/20"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickCancel}
      >
        <div
          className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-white/30 shadow-md transition-transform duration-50"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`
          }}
        />
      </div>

      {/* Right side - Action buttons in arc layout */}
      <div className="absolute right-2 bottom-2 pointer-events-auto">
        {/* Main action - AIM & CAST (large joystick, bottom right) */}
        <div
          ref={aimRef}
          className="absolute right-0 bottom-0 w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/80 to-purple-800/80 border-3 border-purple-400/70 flex items-center justify-center shadow-lg shadow-purple-500/30"
          onTouchStart={handleAimStart}
          onTouchMove={handleAimMove}
          onTouchEnd={handleAimEnd}
        >
          <div
            className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white/40 shadow-md flex items-center justify-center transition-transform duration-50"
            style={{
              transform: `translate(${aimPos.x}px, ${aimPos.y}px)`
            }}
          >
            <span className="text-lg">✨</span>
          </div>
        </div>
        
        {/* JUMP (large, above cast) */}
        <button
          className="absolute right-2 bottom-24 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 border-2 border-green-400/70 flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/30 active:scale-95 active:brightness-125 transition-all"
          onTouchStart={handleButtonStart('jump')}
          onTouchEnd={handleButtonEnd('jump')}
        >
          <span className="text-xl">⬆</span>
        </button>
        
        {/* DASH (medium, left of cast) */}
        <button
          className="absolute right-24 bottom-2 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 border-2 border-cyan-400/70 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30 active:scale-95 active:brightness-125 transition-all"
          onTouchStart={handleButtonStart('dash')}
          onTouchEnd={handleButtonEnd('dash')}
        >
          <span className="text-lg">💨</span>
        </button>
        
        {/* SWITCH SPELL (small, top left of group) */}
        <button
          className="absolute right-24 bottom-20 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 border-2 border-indigo-400/70 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/30 active:scale-95 active:brightness-125 transition-all"
          onTouchStart={handleButtonStart('switch')}
          onTouchEnd={handleButtonEnd('switch')}
        >
          <span className="text-base">🔄</span>
        </button>
      </div>
    </div>
  );
}