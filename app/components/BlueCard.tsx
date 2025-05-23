'use client';
import React, { useState } from 'react';

interface BlueCardProps {
  title: string;
  value: number | string;
  flippable?: boolean;
  backTitle?: string;
  backValue?: number | string;
}

const BlueCard: React.FC<BlueCardProps> = ({
  title,
  value,
  flippable = false,
  backTitle,
  backValue,
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative inline-block w-full max-w-xs sm:max-w-[250px] h-28 sm:h-[110px] cursor-pointer transition-transform duration-200 hover:scale-110 hover:shadow-2xl"
      onClick={() => flippable && setFlipped((f) => !f)}
      style={{ perspective: 1000 }}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500 transform ${
          flipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white w-full h-full flex flex-col justify-center items-center backface-hidden">
          <div className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 tracking-wide drop-shadow">{title}</div>
          <div className="text-2xl sm:text-3xl font-bold drop-shadow-lg">{value}</div>
        </div>
        {/* Back */}
        <div className="bg-blue-200 text-blue-900 rounded-xl shadow-lg p-4 sm:p-6 w-full h-full flex flex-col justify-center items-center absolute top-0 left-0 backface-hidden rotate-y-180">
          <div className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 tracking-wide">{backTitle}</div>
          <div className="text-2xl sm:text-3xl font-bold">{backValue}</div>
        </div>
      </div>
    </div>
  );
};

export default BlueCard;