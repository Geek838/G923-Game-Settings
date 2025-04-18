import React from 'react';
import { gameImages, fallbackImage } from '../data/gameImages';

const colors = [
  'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-indigo-500',
];

function getInitials(name) {
  return name
    .split(/\s+/)
    .map(word => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

export default function GameAvatar({ name }) {
  const imgUrl = gameImages[name] || fallbackImage;
  if (imgUrl && imgUrl !== fallbackImage) {
    return (
      <img
        src={imgUrl}
        alt={name}
        title={name}
        className="w-10 h-10 rounded-full object-cover shadow border border-gray-200 bg-white"
        loading="lazy"
      />
    );
  }
  // fallback initials avatar
  const color = colors[(name.length + name.charCodeAt(0)) % colors.length];
  return (
    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${color} text-white font-bold text-lg shadow`} title={name}>
      {getInitials(name)}
    </div>
  );
}
