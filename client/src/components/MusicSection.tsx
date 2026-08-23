import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to format time based on progress percentage and total duration string (mm:ss)
const formatTime = (progress: number, durationStr: string) => {
  const [mins, secs] = durationStr.split(':').map(Number);
  const totalSecs = mins * 60 + secs;
  const currentSecs = Math.floor((progress / 100) * totalSecs) || 0;
  const m = Math.floor(currentSecs / 60);
  const s = Math.floor(currentSecs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const tracks = [
  {
    id: 1,
    title: 'Chromatic Decay',
    album: 'Void Frequency',
    duration: '4:32',
    genre: 'Progressive Metal'
  },
  {
    id: 2,
    title: 'Neural Drift',
    album: 'Signal Path',
    duration: '6:15',
    genre: 'Electronic/Ambient'
  },
  {
    id: 3,
    title: 'Recursive Echo',
    album: 'Binary Resonance',
    duration: '3:48',
    genre: 'Rock/Electronic'
  }
];

const gearList = [
  { name: 'ESP LTD EC-1000', type: 'Guitar' },
  { name: 'Neural DSP Quad Cortex', type: 'Amp Sim' },
  { name: 'Ableton Live 12', type: 'DAW' },
  { name: 'Universal Audio Apollo', type: 'Interface' },
  { name: 'Serum', type: 'Synth' },
  { name: 'Kontakt 7', type: 'Sampler' }
];

export default function MusicSection() {
  const [activeTrackId, setActiveTrackId] = useState(tracks[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(Array(40).fill(20));

  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const activeTrack = tracks.find(t => t.id === activeTrackId) || tracks[0];

  // Progress simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Visualizer simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisualizerHeights(prev => prev.map(() => 10 + Math.random() * 80));
      }, 100);
    } else {
      // Static sine wave pattern when paused
      setVisualizerHeights(Array(40).fill(0).map((_, i) => {
        return Math.sin((i / 40) * Math.PI * 4) * 30 + 50;
      }));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === activeTrackId);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setActiveTrackId(tracks[nextIndex].id);
    setProgress(0);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    const currentIndex = tracks.findIndex(t => t.id === activeTrackId);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setActiveTrackId(tracks[prevIndex].id);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTrackSelect = (id: number) => {
    if (activeTrackId === id) {
      handlePlayPause();
    } else {
      setActiveTrackId(id);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
      setProgress(percentage);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
    if (Number(e.target.value) > 0) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <section id="music" className="min-h-screen py-24 px-4 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="font-mono text-[#06b6d4] mb-2 tracking-widest text-sm uppercase" style={{ fontFamily: '"Courier Prime", monospace' }}>
            // AUDIO.frequency
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-mono tracking-tighter" style={{ fontFamily: '"Space Mono", monospace', textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>
            Sound Frequency
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side — Audio Player */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a]/80 backdrop-blur-sm shadow-xl"
            >
              <div className="flex items-center gap-6 mb-8">
                <div 
                  className={cn(
                    "w-20 h-20 rounded-full border-4 border-[#06b6d4]/30 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center relative overflow-hidden flex-shrink-0",
                    isPlaying ? "animate-[spin_3s_linear_infinite]" : ""
                  )}
                >
                  {/* Vinyl grooves */}
                  <div className="absolute inset-2 rounded-full border border-gray-700/50"></div>
                  <div className="absolute inset-4 rounded-full border border-gray-700/50"></div>
                  <div className="absolute inset-6 rounded-full border border-gray-700/50"></div>
                  <div className="w-2 h-2 rounded-full bg-[#06b6d4] z-10 shadow-[0_0_10px_#06b6d4]"></div>
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-xl md:text-2xl font-bold font-mono mb-1">{activeTrack.title}</h3>
                  <p className="text-gray-400 text-sm mb-2 font-mono">{activeTrack.album}</p>
                  <div className="inline-flex items-center self-start px-2 py-1 rounded-md bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] text-xs font-mono">
                    {activeTrack.genre}
                  </div>
                </div>
              </div>

              {/* Audio Visualizer */}
              <div className="h-16 flex items-end justify-center gap-[2px] mb-6">
                {visualizerHeights.map((height, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-[#06b6d4] rounded-t-sm transition-all duration-100 ease-in-out"
                    style={{ 
                      height: `${height}%`,
                      opacity: 0.5 + (height / 200) 
                    }}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div 
                  ref={progressBarRef}
                  className="h-1 bg-[#2a2a2a] rounded-full cursor-pointer relative mb-2"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#06b6d4] rounded-full shadow-[0_0_10px_#06b6d4]"
                    style={{ width: `${progress}%` }}
                  />
                  <div 
                    className="absolute top-1/2 w-3 h-3 bg-white rounded-full -translate-y-1/2 -ml-1.5 shadow-[0_0_10px_rgba(255,255,255,0.5)] cursor-grab active:cursor-grabbing"
                    style={{ left: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-mono" style={{ fontFamily: '"Courier Prime", monospace' }}>
                  <span>{formatTime(progress, activeTrack.duration)}</span>
                  <span>{activeTrack.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={handlePrev} className="text-gray-400 hover:text-white transition-colors">
                    <SkipBack size={24} />
                  </button>
                  <button 
                    onClick={handlePlayPause}
                    className="w-12 h-12 rounded-full border border-[#06b6d4] flex items-center justify-center text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] pl-[2px]" // extra padding left for triangle visual balance
                  >
                    {isPlaying ? <Pause size={20} className="-ml-[2px]" /> : <Play size={20} />}
                  </button>
                  <button onClick={handleNext} className="text-gray-400 hover:text-white transition-colors">
                    <SkipForward size={24} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={isMuted ? 0 : volume} 
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-[#2a2a2a] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#06b6d4] [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Track List */}
            <div className="flex flex-col gap-3">
              {tracks.map((track, idx) => {
                const isActive = activeTrackId === track.id;
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                    onClick={() => handleTrackSelect(track.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-between group",
                      isActive 
                        ? "border-[#06b6d4]/50 bg-[#06b6d4]/5" 
                        : "border-[#2a2a2a] hover:border-[#06b6d4]/30 hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border",
                        isActive ? "border-[#06b6d4]/50" : "border-gray-700"
                      )}>
                        {isActive && isPlaying ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#06b6d4]/50 border-t-[#06b6d4] animate-spin" />
                        ) : (
                          <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-[#06b6d4]" : "bg-gray-600")} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={cn(
                          "font-mono font-bold text-sm md:text-base",
                          isActive ? "text-[#06b6d4]" : "text-gray-200 group-hover:text-white"
                        )}>
                          {track.title}
                        </span>
                        <span className="text-gray-500 text-xs font-mono">{track.genre}</span>
                      </div>
                    </div>
                    <div className={cn("text-sm font-mono", isActive ? "text-[#06b6d4]" : "text-gray-500")}>
                      {track.duration}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Side — Studio Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a]/80 backdrop-blur-sm h-fit"
          >
            <h3 className="text-2xl font-bold font-mono mb-1" style={{ fontFamily: '"Space Mono", monospace', textShadow: '0 0 10px rgba(6,182,212,0.4)' }}>
              The Studio
            </h3>
            <p className="font-mono text-[#06b6d4] mb-6 text-sm tracking-wider" style={{ fontFamily: '"Courier Prime", monospace' }}>
              // WHERE THE FREQUENCIES ARE FORGED
            </p>

            <div className="aspect-video w-full mb-6 rounded-xl border border-[#2a2a2a] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0a0a] to-[#0a0a0a]" />
              <div className="text-6xl z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                🎸
              </div>
            </div>

            <h4 className="font-mono text-gray-400 text-sm mb-4 tracking-widest uppercase">Signal Chain & Arsenal</h4>
            
            <div className="grid grid-cols-2 gap-3">
              {gearList.map((gear, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 hover:border-[#06b6d4]/30 hover:bg-[#06b6d4]/5 transition-colors group"
                >
                  <div className="text-xs text-[#06b6d4] font-mono mb-1 opacity-80 group-hover:opacity-100">{gear.type}</div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-white">{gear.name}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
