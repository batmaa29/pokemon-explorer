import { useEffect, useMemo, useState } from 'react'
import PokemonCard from './PokemonCard'
import PokemonDetail from './PokemonDetail'

const API = 'https://pokeapi.co/api/v2'
const TYPES = ['all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
const FAVORITES_KEY = 'pokemon-explorer-favorites'

async function getPokemon(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Unable to load Pokémon')
  return response.json()
}

export default function PokemonList() {
  const [pokemon, setPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('number')
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'))
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let active = true
    getPokemon(`${API}/pokemon?limit=151`).then((data) => Promise.all(data.results.map((item) => getPokemon(item.url))))
      .then((data) => active && setPokemon(data))
      .catch(() => active && setError('We could not load the Pokédex. Please try again.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const visiblePokemon = useMemo(() => pokemon
    .filter((item) => !favoritesOnly || favorites.includes(item.id))
    .filter((item) => type === 'all' || item.types.some((entry) => entry.type.name === type))
    .filter((item) => item.name.includes(search.trim().toLowerCase()))
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'stats' ? b.stats.reduce((sum, stat) => sum + stat.base_stat, 0) - a.stats.reduce((sum, stat) => sum + stat.base_stat, 0) : a.id - b.id), [pokemon, search, type, sort, favoritesOnly, favorites])

  return (
    <main className="pokedex">
      <section className="hero">
        <div><p className="eyebrow">Kanto collection · 001—151</p><h1>Find your next <span>favorite.</span></h1><p>Browse the original Pokédex and learn something new.</p></div>
        <div className="hero-ball" aria-hidden="true"><div /></div>
      </section>
      <section className="toolbar" aria-label="Pokémon filters">
        <label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Pokémon..." aria-label="Search Pokémon" /></label>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort Pokémon"><option value="number">Pokédex number</option><option value="name">Name A–Z</option><option value="stats">Total stats</option></select>
        <button className={`favorite-toggle ${favoritesOnly ? 'active' : ''}`} onClick={() => setFavoritesOnly(!favoritesOnly)}>♥ Favorites <b>{favorites.length}</b></button>
      </section>
      <div className="type-scroller">{TYPES.map((item) => <button key={item} className={`type-filter type-${item} ${type === item ? 'active' : ''}`} onClick={() => setType(item)}>{item === 'all' ? 'All types' : item}</button>)}</div>
      {error && <div className="empty-state"><h2>Oops!</h2><p>{error}</p><button className="primary-button" onClick={() => window.location.reload()}>Try again</button></div>}
      {loading && <div className="card-grid">{Array.from({ length: 12 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-image" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}</div>}
      {!loading && !error && visiblePokemon.length === 0 && <div className="empty-state"><div className="empty-ball">◓</div><h2>No Pokémon here yet</h2><p>Try a different search or filter, Trainer.</p><button className="secondary-button" onClick={() => { setSearch(''); setType('all'); setFavoritesOnly(false) }}>Clear filters</button></div>}
      {!loading && !error && visiblePokemon.length > 0 && <div className="card-grid">{visiblePokemon.map((item) => <PokemonCard key={item.id} pokemon={item} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} onSelect={setSelected} />)}</div>}
      {selected && <PokemonDetail pokemon={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
