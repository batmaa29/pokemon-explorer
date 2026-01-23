import React from 'react'

export default function PokemonCard({ pokemon, onSelect }) {
  return (
    <button
      onClick={() => onSelect(pokemon)}
      className="bg-slate-800 p-4 rounded-xl border-2 border-slate-700 hover:border-yellow-400/60 hover:shadow-lg transform-gpu hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 text-left w-full"
    >
      <div className="text-center">
        <img
          src={pokemon.sprites.front_default || ''}
          alt={pokemon.name}
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
        />
        <h3 className="text-white capitalize font-bold mt-2">{pokemon.name}</h3>
        <div className="mt-2 flex gap-2 justify-center flex-wrap">
          {pokemon.types?.map((t) => (
            <span
              key={t.type.name}
              className="text-xs px-2 py-1 rounded bg-yellow-400 text-slate-900 capitalize"
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
