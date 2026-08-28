import { useState } from 'react'
import PokemonList from './components/PokemonList'

function App() {
  const [started, setStarted] = useState(false)

  if (!started) {
    return (
      <main className="landing">
        <div className="pokeball pokeball-one" aria-hidden="true" />
        <div className="pokeball pokeball-two" aria-hidden="true" />
        <div className="pokeball pokeball-three" aria-hidden="true" />
        <section className="landing-card">
          <div className="brand-mark">◓</div>
          <p className="eyebrow">Your friendly field guide</p>
          <h1>Pokémon <span>Explorer</span></h1>
          <p className="landing-copy">Meet your next favorite Pokémon. Search, sort, and discover the stats behind every adventure.</p>
          <button className="primary-button" onClick={() => setStarted(true)}>Start exploring <span>→</span></button>
          <div className="landing-hint"><span className="spark">✦</span> Powered by PokéAPI</div>
        </section>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="mini-brand" onClick={() => setStarted(false)} aria-label="Back to welcome"><span>◓</span> Pokémon Explorer</button>
        <div className="header-note">Gotta discover them all!</div>
      </header>
      <PokemonList />
    </div>
  )
}

export default App
