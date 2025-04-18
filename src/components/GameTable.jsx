import React, { useState } from 'react';
import SettingsModal from './SettingsModal';
import GameAvatar from './GameAvatar';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 'All'];

export default function GameTable({ games }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [search, setSearch] = useState('');
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );
  const effectivePageSize = resultsPerPage === 'All' ? filteredGames.length : resultsPerPage;
  const totalPages = Math.max(1, Math.ceil(filteredGames.length / effectivePageSize));
  const paginatedGames = filteredGames.slice((page - 1) * effectivePageSize, page * effectivePageSize);

  function handleResultsPerPage(e) {
    const val = e.target.value === 'All' ? 'All' : Number(e.target.value);
    setResultsPerPage(val);
    setPage(1);
  }

  return (
    <div className="bg-white shadow rounded-xl p-6 mt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Logitech G29/G923 Racing Game Settings</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider bg-blue-50">Game</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider bg-blue-50">G Hub</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider bg-blue-50">In-Game</th>
              <th className="px-6 py-3 bg-blue-50"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedGames.map(game => (
              <tr key={game.name} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-3">
                  <GameAvatar name={game.name} />
                  <span>{game.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                    {Object.keys(game.data.G_HUB_Settings || {}).length > 0 ? 'Yes' : '—'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                    {Object.keys(game.data.In_Game_Settings || {}).length > 0 ? 'Yes' : '—'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedGame(game)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {paginatedGames.length} of {filteredGames.length} games
        </div>
        <div className="flex items-center gap-2">
          <select
            value={resultsPerPage}
            onChange={handleResultsPerPage}
            className="border rounded px-2 py-1"
          >
            {PAGE_SIZE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt === 'All' ? 'All' : `${opt} per page`}</option>
            ))}
          </select>
          {totalPages > 1 && resultsPerPage !== 'All' && (
            <>
              <span>Page</span>
              <select
                value={page}
                onChange={e => setPage(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <span>of {totalPages}</span>
            </>
          )}
        </div>
      </div>
      {selectedGame && (
        <SettingsModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  );
}
