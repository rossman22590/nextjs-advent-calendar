"use client";

import { useState, useEffect } from "react";

export default function BackgroundEffects() {
  const [error, setError] = useState<Error | null>(null);
  const [GridScan, setGridScan] = useState<any>(null);

  useEffect(() => {
    // Dynamic import with error handling
    import("./GridScan")
      .then((mod) => {
        setGridScan(() => mod.GridScan);
      })
      .catch((err) => {
        console.error("Failed to load GridScan:", err);
        setError(err);
      });
  }, []);

  if (error || !GridScan) {
    // Fallback to a simple CSS animated background
    return (
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 opacity-60 bg-gradient-to-br from-gray-900/80 via-purple-900/80 to-gray-900/80">
          <div className="absolute inset-0 animate-pulse">
            <div className="grid grid-cols-12 grid-rows-12 w-full h-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-pink-500/20 backdrop-blur-sm"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    animation: `fadeIn 2.5s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <GridScan
          sensitivity={0.55}
          lineThickness={1.5}
          linesColor="#1a1a2e"
          gridScale={0.05}
          scanColor="#FF00FF"
          scanOpacity={0.4}
          enablePost={false}
          bloomIntensity={0}
          chromaticAberration={0}
          noiseIntensity={0.002}
          style={{ 
            width: '100%', 
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000ff'
          }}
        />
      </div>
    </div>
  );
}
