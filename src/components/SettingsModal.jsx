import React from 'react'

export default function SettingsModal({ game, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{game.name} Settings</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Setting</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(game.data).map(([sectionKey, sectionValue]) => (
                <React.Fragment key={sectionKey}>
                  <tr className="bg-gray-100">
                    <td colSpan={2} className="px-4 py-2 text-sm font-semibold text-gray-700">
                      {sectionKey.replace(/_/g, ' ')}
                    </td>
                  </tr>
                  {Object.entries(sectionValue).map(([key, value]) =>
                    typeof value !== 'object' ? (
                      <tr key={key}>
                        <td className="px-4 py-2 text-sm text-gray-800">{key}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{value}</td>
                      </tr>
                    ) : (
                      <React.Fragment key={key}>
                        <tr className="bg-gray-50">
                          <td colSpan={2} className="px-4 py-2 text-sm font-medium text-gray-600">
                            {key}
                          </td>
                        </tr>
                        {Object.entries(value).map(([subKey, subValue]) => (
                          <tr key={subKey}>
                            <td className="px-4 py-2 text-sm text-gray-800">{subKey}</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{subValue}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
