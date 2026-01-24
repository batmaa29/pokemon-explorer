import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function PokemonDetail({ pokemon, onClose }) {
  const [visible, setVisible] = useState(false)
  const [species, setSpecies] = useState(null)
  const [statWidths, setStatWidths] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 0)
    return () => {
      clearTimeout(timer)
      setVisible(false)
    }
  }, [pokemon])

  useEffect(() => {
    if (pokemon) {
      fetch(pokemon.species.url)
        .then(res => res.json())
        .then(data => setSpecies(data))
        .catch(err => console.error(err))
    }
  }, [pokemon])

  useEffect(() => {
    if (pokemon && visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatWidths(new Array(pokemon.stats.length).fill(0))
      const timer = setTimeout(() => {
        setStatWidths(pokemon.stats.map(s => Math.min(100, s.base_stat)))
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [pokemon, visible])

  if (!pokemon) return null

  const modal = (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onClose} />
      <div
        className={`pointer-events-auto bg-white border-2 border-black p-3 sm:p-4 rounded-xl text-black relative transform transition-all duration-200 shadow-2xl overflow-y-auto max-h-[90vh] ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 'min(95%, 480px)' }}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl capitalize font-bold">{pokemon.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black bg-gray-200 px-3 py-1 rounded"
          >
            Back
          </button>
        </div>

        {species && (
          <div className="mt-4">
            <p className="text-gray-700">
              {species.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ')}
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-col md:flex-row gap-6">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-40 h-40 mx-auto md:mx-0"
          />

          <div className="flex-1">
            <div>
              <h3 className="font-semibold">Types</h3>
              <div className="flex gap-2 mt-2">
                {pokemon.types.map((t) => (
                  <span key={t.type.name} className="px-2 py-1 bg-yellow-400 text-slate-900 rounded capitalize text-sm">{t.type.name}</span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Abilities</h3>
              <ul className="list-disc list-inside mt-2">
                {pokemon.abilities.map((a) => (
                  <li key={a.ability.name} className="capitalize">{a.ability.name}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Stats</h3>
              <div className="mt-2 space-y-2">
                {pokemon.stats.map((s, index) => (
                  <div key={s.stat.name} className="flex items-center gap-4">
                    <div className="w-24 text-sm capitalize">{s.stat.name}</div>
                    <div className="flex-1 bg-gray-300 rounded h-3 overflow-hidden">
                      <div className="bg-blue-500 h-3 transition-all duration-1000 ease-out" style={{ width: `${statWidths[index] || 0}%` }} />
                    </div>
                    <div className="w-8 text-right">{s.base_stat}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
