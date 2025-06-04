'use client';
import React from 'react';

interface BlueCardProps {
  title: string;
  value: number | string;
}

const BlueCard: React.FC<BlueCardProps> = ({
  title,
  value,
}) => {
  return (
    <div
      className="relative inline-block w-full max-w-xs sm:max-w-[250px] h-28 sm:h-[110px] cursor-pointer transition-transform duration-200 hover:scale-110 hover:shadow-2xl"
      style={{ perspective: 1000 }}
    >
      <div
        className="absolute inset-0 transition-transform duration-500 transform"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white w-full h-full flex flex-col justify-center items-center backface-hidden">
          <div className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 tracking-wide drop-shadow">{title}</div>
          <div className="text-2xl sm:text-3xl font-bold drop-shadow-lg">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default BlueCard;