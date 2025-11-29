"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Prize {
  id: number;
  name: string;
  color: string;
  weight: number;
  description?: string | null;
}

interface PrizeWheelProps {
  prizes: Prize[];
  calendarId: string;
  hasSpun: boolean;
  wonPrizeId: number | null;
}

export default function PrizeWheel({
  prizes,
  calendarId,
  hasSpun,
  wonPrizeId,
}: PrizeWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<Prize | null>(
    hasSpun ? prizes.find((p) => p.id === wonPrizeId) || null : null,
  );
  const [showResult, setShowResult] = useState(hasSpun);
  const router = useRouter();

  const segmentAngle = 360 / prizes.length;

  const spin = async () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setShowResult(false);

    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendarId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to spin");
        setIsSpinning(false);
        return;
      }

      const wonPrize = prizes.find((p) => p.id === data.prizeId);
      const prizeIndex = prizes.findIndex((p) => p.id === data.prizeId);

      const targetAngle = prizeIndex * segmentAngle + segmentAngle / 2;
      const spins = 6;
      const finalRotation = spins * 360 + (360 - targetAngle);

      setRotation(finalRotation);

      setTimeout(() => {
        setResult(wonPrize || null);
        setShowResult(true);
        setIsSpinning(false);
        router.refresh();
      }, 4000);
    } catch (error) {
      console.error("Spin error:", error);
      setIsSpinning(false);
    }
  };

  const isSpecialPrize = (name: string) => {
    const lower = name.toLowerCase();
    return lower.includes("grand") || lower.includes("mystery");
  };

  const getEmoji = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("grand")) return "👑";
    if (lower.includes("mystery")) return "❓";
    if (lower.includes("gift") || lower.includes("card")) return "💳";
    if (lower.includes("coffee")) return "☕";
    if (lower.includes("movie")) return "🎬";
    if (lower.includes("chocolate")) return "🍫";
    return "🎁";
  };

  return (
    <div className="relative flex flex-col items-center gap-8">
      {/* Glowing background effect (dark) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-950/60 to-slate-950 -z-10 blur-3xl opacity-80" />

      {/* Wheel container */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 rounded-full blur-xl opacity-40 animate-pulse" />

        {/* Pointer */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="relative">
            <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[48px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[32px] border-l-transparent border-r-transparent border-t-yellow-300" />
          </div>
        </div>

        {/* Decorative lights around wheel */}
        <div className="absolute -inset-3 z-10 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${
                i % 2 === 0 ? "bg-yellow-300" : "bg-pink-400"
              } shadow-lg`}
              style={{
                left: `${50 + 48 * Math.cos((i * 22.5 * Math.PI) / 180)}%`,
                top: `${50 + 48 * Math.sin((i * 22.5 * Math.PI) / 180)}%`,
                transform: "translate(-50%, -50%)",
                animation: `pulse ${1 + (i % 3) * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Main wheel */}
        <div
          className="w-[30rem] h-[30rem] sm:w-[36rem] sm:h-[36rem] rounded-full relative overflow-hidden shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 4s cubic-bezier(0.15, 0.60, 0.20, 1)"
              : "none",
            background: `conic-gradient(${prizes
              .map((prize, i) => {
                const start = (i / prizes.length) * 100;
                const end = ((i + 1) / prizes.length) * 100;
                return `${prize.color} ${start}% ${end}%`;
              })
              .join(", ")})`,
            border: "8px solid",
            borderColor: "#fbbf24",
            boxShadow:
              "0 0 60px rgba(236, 72, 153, 0.4), inset 0 0 30px rgba(0,0,0,0.2)",
          }}
        >
          {/* Segment dividers - at the START of each segment */}
          {prizes.map((_, index) => {
            const angle = index * segmentAngle;
            return (
              <div
                key={`divider-${index}`}
                className="absolute top-0 left-1/2 w-[3px] bg-white/40 origin-bottom"
                style={{
                  height: "50%",
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                }}
              />
            );
          })}

          {/* Prize labels */}
          {prizes.map((prize, index) => {
            const labelAngle = index * segmentAngle + segmentAngle / 2;
            const isSpecial = isSpecialPrize(prize.name);

            return (
              <div
                key={prize.id}
                className="absolute top-0 left-1/2 origin-bottom"
                style={{
                  height: "50%",
                  transform: `translateX(-50%) rotate(${labelAngle}deg)`,
                }}
              >
                <div
                  className={`absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 ${
                    isSpecial ? "scale-110" : ""
                  }`}
                >
                  <span
                    className={`text-3xl sm:text-4xl ${
                      isSpecial ? "animate-bounce" : ""
                    }`}
                  >
                    {getEmoji(prize.name)}
                  </span>
                  <span
                    className={`font-bold text-white text-center leading-tight ${
                      isSpecial
                        ? "text-base sm:text-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        : "text-sm sm:text-base"
                    }`}
                    style={{
                      textShadow: isSpecial
                        ? "0 0 10px rgba(255,255,255,0.8), 2px 2px 4px rgba(0,0,0,0.5)"
                        : "1px 1px 3px rgba(0,0,0,0.5)",
                      maxWidth: "110px",
                    }}
                  >
                    {prize.name}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Center piece */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full shadow-xl flex items-center justify-center border-4 border-yellow-200">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-6xl sm:text-7xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spin button */}
      {!hasSpun && !showResult && (
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`relative px-12 py-5 rounded-full text-white font-bold text-2xl shadow-2xl transition-all overflow-hidden ${
            isSpinning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:scale-110 active:scale-95"
          }`}
          style={{
            backgroundSize: "200% 100%",
            animation: !isSpinning ? "shimmer 2s linear infinite" : "none",
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isSpinning ? (
              <>
                <span className="animate-spin">🎰</span> Spinning...
              </>
            ) : (
              <>🎯 SPIN TO WIN!</>
            )}
          </span>
          {!isSpinning && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          )}
        </button>
      )}

      {/* Result popup */}
      {showResult && result && (
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 text-center max-w-md">
            <div className="text-5xl mb-4 animate-bounce">🎉</div>
            <p className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent mb-4">
              CONGRATULATIONS!
            </p>
            <p className="text-xl text-gray-600 mb-2">You won:</p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">{getEmoji(result.name)}</span>
              <span className="text-2xl font-bold text-pink-600">
                {result.name}
              </span>
            </div>
            {result.description && (
              <p className="text-gray-600 text-base border-t border-pink-200 pt-4 mt-4">
                {result.description}
              </p>
            )}
          </div>
        </div>
      )}

      {hasSpun && !showResult && result && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-pink-200 text-center max-w-md">
          <p className="text-lg text-gray-500 mb-2">
            You already spun and won:
          </p>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">{getEmoji(result.name)}</span>
            <span className="text-xl font-bold text-pink-500">
              {result.name}
            </span>
          </div>
          {result.description && (
            <p className="text-gray-500 text-sm border-t border-pink-100 pt-3">
              {result.description}
            </p>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
