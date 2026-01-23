import React, { useState, useEffect } from 'react'
import PokemonCard from './PokemonCard'
import PokemonDetail from './PokemonDetail'

const API_BASE = 'https://pokeapi.co/api/v2'

async function fetchPokemonList(limit = 10, offset = 0) {
  const res = await fetch(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`)
  return await res.json()
}

async function fetchPokemonDetail(urlOrName) {
  const url = urlOrName.startsWith('http') ? urlOrName : `${API_BASE}/pokemon/${urlOrName}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Not found')
  return await res.json()
}

async function fetchAllPokemon() {
  const res = await fetch(`${API_BASE}/pokemon?limit=1000`)
  const data = await res.json()
  return data.results
}

export default function PokemonList() {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [limit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(null)
  const [allPokemon, setAllPokemon] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [showMoreTypes, setShowMoreTypes] = useState(false)

  const load = async (nextOffset = 0, replace = false) => {
    setLoading(true)
    try {
      const data = await fetchPokemonList(limit, nextOffset)
      const details = await Promise.all(data.results.map((r) => fetchPokemonDetail(r.url)))
      setPokemons((prev) => (replace ? details : [...prev, ...details]))
      setOffset(nextOffset + limit)
    } catch (err) {
      console.error(err)
      setError('Failed to load Pokémon')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      await load(0, true)
      const all = await fetchAllPokemon()
      setAllPokemon(all)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search) {
      // clear search
      setPokemons([])
      load(0, true)
      return
    }

    setLoading(true)
    try {
      const matches = allPokemon.filter(p => p.name.includes(search.toLowerCase())).slice(0, 10)
      if (matches.length === 0) {
        setError('No Pokémon found')
        setPokemons([])
      } else {
        const details = await Promise.all(matches.map(m => fetchPokemonDetail(m.url)))
        setPokemons(details)
        setError(null)
      }
    } catch (err) {
      setError('Failed to search')
      setPokemons([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name (partial ok, e.g. venu)"
          className="flex-1 p-2 rounded bg-slate-700 text-white outline-none"
        />
        <button className="px-4 bg-yellow-400 text-slate-900 rounded">Search</button>
      </form>

      <div className="mb-6 flex gap-1 sm:gap-2 flex-wrap">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${selectedType === null ? 'bg-yellow-400 text-slate-900' : 'bg-slate-600 text-white'}`}
        >
          All
        </button>
        {['normal', 'fire', 'water', 'grass', 'flying', 'fighting', 'poison', 'electric'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base capitalize ${selectedType === type ? 'bg-yellow-400 text-slate-900' : 'bg-slate-600 text-white'}`}
          >
            {type}
          </button>
        ))}
        <button
          onClick={() => setShowMoreTypes(!showMoreTypes)}
          className="px-2 sm:px-3 py-1 rounded text-sm sm:text-base bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {showMoreTypes ? 'Less' : 'More'}
        </button>
      </div>

      {showMoreTypes && (
        <div className="mb-6 flex gap-1 sm:gap-2 flex-wrap">
          {['ground', 'rock', 'psychic', 'ice', 'bug', 'ghost', 'steel', 'dragon', 'dark', 'fairy'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base capitalize ${selectedType === type ? 'bg-yellow-400 text-slate-900' : 'bg-slate-600 text-white'}`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {error && <div className="text-red-400 mb-4">{error}</div>}

      {loading && pokemons.length === 0 ? (
        <div className="text-center">Loading Pokédex...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {pokemons.filter(p => !selectedType || p.types.some(t => t.type.name === selectedType)).map((p) => (
            <PokemonCard key={p.id} pokemon={p} onSelect={(pok) => setSelected(pok)} />
          ))}
        </div>
      )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={pokemons.length >= 200 ? () => setPokemons(pokemons.slice(0, 50)) : () => load(offset)}
            className="px-4 py-2 bg-yellow-400 text-slate-900 rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : pokemons.length >= 200 ? 'See less' : 'Load more'}
          </button>
        </div>

      {selected && (
        <PokemonDetail
          pokemon={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
