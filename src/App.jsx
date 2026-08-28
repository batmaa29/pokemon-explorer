import { useEffect, useState } from 'react'
import PokemonList from './components/PokemonList'
import CardCollection from './components/CardCollection'

const API = 'https://pokeapi.co/api/v2'

const REQUEST_TIMEOUT = 8000

async function fetchJson(url, signal) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`PokéAPI request failed (${response.status})`)
    return await response.json()
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}

async function loadPokemon(onPokemon, signal) {
  const data = await fetchJson(`${API}/pokemon?limit=151`, signal)
  let nextIndex = 0
  const worker = async () => {
    while (!signal.aborted) {
      const index = nextIndex
      nextIndex += 1
      if (index >= data.results.length) return
      try {
        const result = await fetchJson(data.results[index].url, signal)
        if (!signal.aborted) onPokemon(result)
      } catch (requestError) {
        if (!signal.aborted) console.warn(`Skipping Pokémon ${data.results[index].name}: ${requestError.message}`)
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(8, data.results.length) }, worker))
}

function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname || '/')
  const [pokemon, setPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', onPopState)
    const controller = new AbortController()
    loadPokemon((item) => {
      setPokemon((current) => [...current, item].sort((a, b) => a.id - b.id))
      setLoading(false)
    }, controller.signal).catch(() => {
      if (!controller.signal.aborted) setError('We could not load the Pokédex. Please try again.')
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => {
      controller.abort()
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  if (path === '/') {
    return (
      <main className="landing">
        <div className="pokeball pokeball-one" aria-hidden="true" />
        <div className="pokeball pokeball-two" aria-hidden="true" />
        <div className="pokeball pokeball-three" aria-hidden="true" />
        <section className="landing-card">
          <div className="brand-mark" aria-label="Pokéball logo"><span /></div>
          <div className="landing-mascots" aria-hidden="true">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="" />
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" alt="" />
          </div>
          <p className="eyebrow">Your friendly field guide</p>
          <h1>Pokémon <span>Explorer</span></h1>
          <p className="landing-copy">Meet your next favorite Pokémon. Search, sort, and discover the stats behind every adventure.</p>
          <div className="landing-actions">
            <button className="primary-button" onClick={() => navigate('/pokedex')}>Explore Pokédex <span>→</span></button>
            <button className="secondary-button" onClick={() => navigate('/collection')}>View Card Collection <span>→</span></button>
          </div>
        </section>
      </main>
    )
  }

  const section = path === '/collection' ? <CardCollection pokemon={pokemon} loading={loading} error={error} /> : <PokemonList pokemon={pokemon} loading={loading} error={error} />
  return <div className="app-shell">
    <header className="app-header">
      <button className="mini-brand" onClick={() => navigate('/')} aria-label="Back to welcome"><span className="mini-ball" /> Pokémon Explorer</button>
      <nav className="top-nav" aria-label="Primary navigation">
        <button type="button" className={path === '/pokedex' ? 'active' : ''} aria-current={path === '/pokedex' ? 'page' : undefined} onClick={() => navigate('/pokedex')}>Pokédex</button>
        <button type="button" className={path === '/collection' ? 'active' : ''} aria-current={path === '/collection' ? 'page' : undefined} onClick={() => navigate('/collection')}>Card Collection</button>
        <button type="button" className="back-button" onClick={() => navigate('/')}>← Back to welcome</button>
      </nav>
      <div className="header-note">Gotta discover them all!</div>
    </header>
    {section}
  </div>
}

export default App
