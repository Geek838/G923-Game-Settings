import { useParams, Link } from 'react-router-dom'
import rawSettings from '../data/g29_settings.json'

// Utility to convert game names to URL-friendly slugs
function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export default function GameSettings() {
  const { id } = useParams()
  // Find the game entry by slug
  const entry = Object.entries(rawSettings).find(([name]) => slugify(name) === id)
  const gameName = entry ? entry[0] : null
  const gameData = entry ? entry[1] : null

  if (!gameData) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Game not found</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mb-4">{gameName} Settings</h1>
      <div className="bg-white shadow rounded p-6">
        {/* Render each settings section */}
        {Object.entries(gameData).map(([sectionKey, sectionValue]) => (
          <div key={sectionKey} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{sectionKey.replace(/_/g, ' ')}</h2>
            {/* Flat settings object */}
            {Object.entries(sectionValue).every(([_, v]) => typeof v !== 'object') ? (
              <ul className="list-disc list-inside">
                {Object.entries(sectionValue).map(([k, v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            ) : (
              /* Nested settings groups */
              Object.entries(sectionValue).map(([subKey, subVal]) => (
                <div key={subKey} className="mb-4">
                  <h3 className="text-lg font-medium">{subKey}</h3>
                  <ul className="list-disc list-inside">
                    {Object.entries(subVal).map(([k, v]) => (
                      <li key={k}><strong>{k}:</strong> {v}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
