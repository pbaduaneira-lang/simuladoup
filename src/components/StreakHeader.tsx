"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { usePathname } from "next/navigation";

export function StreakHeader() {
  const pathname = usePathname();
  
  // Fake state for demonstration
  // In a real app, this would be fetched from the API / Zustand store based on DailyGoal
  const [streak, setStreak] = useState(5);
  const [dailyCount, setDailyCount] = useState(7);
  const dailyTarget = 10;
  
  // Do not show on onboarding or battle pages
  if (pathname.includes("/onboarding") || pathname.includes("/batalha")) {
    return null;
  }

  const progress = Math.min(dailyCount / dailyTarget, 1);
  const isComplete = progress === 1;

  const circumference = 2 * Math.PI * 16; // radius = 16
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-3 glass px-3 py-2 rounded-full neo-brutalism">
      <div className="flex items-center gap-1">
        <Flame className={`w-5 h-5 ${isComplete ? 'text-secondary drop-shadow-[0_0_10px_rgba(190,242,100,0.8)]' : 'text-orange-500'}`} />
        <span className="font-black text-sm">{streak} dias</span>
      </div>

      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Background track */}
        <svg className="w-10 h-10 transform -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-muted/50"
          />
          {/* Animated Progress Ring */}
          <motion.circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeLinecap="round"
            className={isComplete ? 'text-secondary' : 'text-orange-500'}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        <span className="absolute text-[10px] font-bold">
          {dailyCount}/{dailyTarget}
        </span>
      </div>
    </div>
  );
}
