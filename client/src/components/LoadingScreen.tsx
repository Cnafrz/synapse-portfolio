import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootMessages = [
  "> Initializing creative kernel v3.0...",
  "> Loading code frequency module... [OK]",
  "> Loading sound frequency module... [OK]",
  "> Loading visual frequency module... [OK]",
  "> Calibrating shader pipelines...",
  "> Establishing neural links...",
  "> System ready."
];

export default function LoadingScreen({ onLoadComplete }: { onLoadComplete: () => void }) {
  const [phase, setPhase] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Phase 1 (0-0.5s): Pure black screen, single blinking cursor
    const t1 = setTimeout(() => setPhase(2), 500);
    // Phase 2 (0.5-1.5s): Terminal-style text rapidly prints boot messages
    const t2 = setTimeout(() => setPhase(3), 1500);
    // Phase 3 (1.5-2.2s): Text fades, logo appears, letters assemble, circles orbit
    const t3 = setTimeout(() => setPhase(4), 2200);
    // Phase 4 (2.2-3s): Progress bar fills with gradient, glitch flicker at 100%
    const t4 = setTimeout(() => setPhase(5), 3000);
    // Phase 5 (3s+): Screen dissolves
    const t5 = setTimeout(() => {
      setIsComplete(true);
      onLoadComplete();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onLoadComplete]);

  if (isComplete) return null;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={phase === 5 ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {phase === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="w-3 h-6 bg-[#a855f7]"
            />
          )}

          {phase === 2 && (
            <div className="w-full max-w-3xl px-8 text-sm md:text-base font-mono text-[#a855f7] flex flex-col items-start justify-center h-full">
              {bootMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.2 }}
                  className="mb-2"
                >
                  {msg}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: bootMessages.length * 0.1 }}
                className="w-2.5 h-4 bg-[#a855f7] mt-2 inline-block"
              />
            </div>
          )}

          {(phase === 3 || phase === 4) && (
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex space-x-3 text-5xl md:text-7xl font-bold font-sans text-white tracking-[0.2em] mb-12">
                {['C', 'E', 'N', 'A'].map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{
                      opacity: 0,
                      x: (Math.random() - 0.5) * 150,
                      y: (Math.random() - 0.5) * 150,
                      rotate: (Math.random() - 0.5) * 180,
                    }}
                    animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 10
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              <div className="flex space-x-4 mb-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-16 h-16 relative flex items-center justify-center"
                >
                  <div className="absolute w-4 h-4 rounded-full bg-[#a855f7] top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#a855f7]" />
                  <div className="absolute w-4 h-4 rounded-full bg-[#06b6d4] bottom-0 left-0 shadow-[0_0_10px_#06b6d4]" />
                  <div className="absolute w-4 h-4 rounded-full bg-[#ea580c] bottom-0 right-0 shadow-[0_0_10px_#ea580c]" />
                </motion.div>
              </div>

              {phase === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-64 md:w-80 h-2 bg-neutral-900 rounded-full overflow-hidden relative"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#a855f7] via-[#06b6d4] to-[#ea580c]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.7, ease: "circOut" }}
                    style={{
                      boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)"
                    }}
                  />
                  {/* Glitch flicker at 100% */}
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0, 1, 0] }}
                    transition={{ delay: 0.65, duration: 0.2 }}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
