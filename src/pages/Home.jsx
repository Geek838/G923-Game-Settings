import React from 'react';
import rawSettings from '../data/g29_settings.json';
import GameTable from '../components/GameTable';

export default function Home() {
  const games = Object.entries(rawSettings).map(([name, data]) => ({ name, data }));
  return (
    <div className="container mx-auto p-4 md:p-8">
      <GameTable games={games} />
    </div>
  );
}
