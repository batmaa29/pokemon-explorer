import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchCardArt } from './tcgApi'

const COLLECTED_KEY = 'pokemon-collected-cards'
const typeColors = { normal: '#a8a77a', fire: '#ee8130', water: '#6390f0', electric: '#f7d02c', grass: '#7ac74c', ice: '#96d9d6', fighting: '#c22e28', poison: '#a33ea1', ground: '#e2bf65', flying: '#a98ff3', psychic: '#f95587', bug: '#a6b91a', rock: '#b6a136', ghost: '#735797', dragon: '#6f35fc', dark: '#705746', steel: '#b7b7ce', fairy: '#d685ad' }

export default function CardCollection({ pokemon, loading, error }) {
  const [collected, setCollected] = useState(() => JSON.parse(localStorage.getItem(COLLECTED_KEY) || '[]'))
  const [art, setArt] = useState({})
  const [filter, setFilter] = useState('all')
  const [rarityFilter, setRarityFilter] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const requestedArt = useRef(new Set())
  const mounted = useRef(true)

  useEffect(() => { localStorage.setItem(COLLECTED_KEY, JSON.stringify(collected)) }, [collected])

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    const pendingPokemon = pokemon.filter((item) => {
      if (requestedArt.current.has(item.id)) return false
      requestedArt.current.add(item.id)
      return true
    })
    if (!pendingPokemon.length) return undefined
    const loadArt = async () => {
      setArt((current) => ({
        ...current,
        ...Object.fromEntries(pendingPokemon.map((item) => [item.id, { status: 'pending' }])),
      }))
      let nextIndex = 0
      const worker = async () => {
        while (mounted.current) {
          const index = nextIndex
          nextIndex += 1
          if (index >= pendingPokemon.length) return
          const item = pendingPokemon[index]
          const cardArt = await fetchCardArt(item.name, item.id)
          if (!mounted.current) return
          setArt((current) => ({ ...current, [item.id]: cardArt }))
        }
      }
      await Promise.all(Array.from({ length: Math.min(4, pendingPokemon.length) }, worker))
    }
    loadArt()
  }, [pokemon])

  useEffect(() => {
    if (!lightbox) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && setLightbox(null)
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [lightbox])

  const visible = useMemo(() => pokemon.filter((item) => {
    const inCollection = filter !== 'collection' || collected.includes(item.id)
    const rarity = item.id % 11 === 0 ? 'Rare' : item.id % 4 === 0 ? 'Uncommon' : 'Common'
    return inCollection && (rarityFilter === 'All' || rarity === rarityFilter)
  }), [pokemon, filter, rarityFilter, collected])
  const toggleCollected = (id) => setCollected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const fallback = (item) => item.sprites.other?.['official-artwork']?.front_default || item.sprites.front_default
  const openLightbox = (item) => setLightbox(item)

  return <main className="pokedex collection-page">
    <section className="hero collection-hero"><div className="collection-hero-content"><p className="eyebrow">Batsss collection · 001—151</p><h1>Collect them <span>all.</span></h1><p>Browse every card at a glance and add favorites directly to your binder.</p></div><div className="hero-ball collection-hero-ball" aria-hidden="true"><div /></div></section>
    <div className="collection-toolbar"><div className="collection-tabs collection-toolbar-group"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Cards</button><button className={filter === 'collection' ? 'active' : ''} onClick={() => setFilter('collection')}>My Collection</button></div><div className="rarity-filters collection-toolbar-group" aria-label="Filter by rarity">{['All', 'Common', 'Uncommon', 'Rare'].map((rarity) => <button key={rarity} className={rarityFilter === rarity ? 'active' : ''} onClick={() => setRarityFilter(rarity)}>{rarity}</button>)}</div><strong className="collection-progress collection-toolbar-progress">{collected.length} / {pokemon.length} collected</strong></div>
    <div className="progress-track"><span style={{ width: `${pokemon.length ? Math.min(100, collected.length / pokemon.length * 100) : 0}%` }} /></div>
    {error && <div className="empty-state"><h2>Oops!</h2><p>{error}</p></div>}
    {loading && pokemon.length === 0 && <div className="card-grid">{Array.from({ length: 8 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-image" /></div>)}</div>}
    {!loading && !error && visible.length === 0 && <div className="empty-state"><div className="empty-ball">◓</div><h2>{filter === 'collection' ? 'Your binder is empty' : 'No cards match this filter'}</h2><p>{filter === 'collection' ? 'Tap collect on any card to start your collection.' : 'Try another rarity or view all cards.'}</p></div>}
    {!error && visible.length > 0 && <div className="trading-card-grid" key={`${filter}-${rarityFilter}`}>{visible.map((item, index) => {
      const type = item.types[0].type.name
      const rarity = item.id % 11 === 0 ? 'Rare' : item.id % 4 === 0 ? 'Uncommon' : 'Common'
      const cardArt = art[item.id]
      const image = cardArt?.status === 'ready' ? cardArt.url : cardArt?.status === 'fallback' ? fallback(item) : null
      return <article className="trading-card" style={{ '--type-color': typeColors[type], '--card-delay': `${Math.min(index, 11) * 55}ms` }} key={item.id}>
        <div className="trading-card-front"><span className="card-rarity">{rarity} · ★</span><span className="dex-number">#{String(item.id).padStart(3, '0')}</span>{image ? <img src={image} alt={item.name} loading="lazy" onError={() => { console.warn(`Using PokeAPI fallback art for ${item.name}`); setArt((state) => ({ ...state, [item.id]: { status: 'fallback', url: fallback(item), reason: 'image unavailable' } })) }} /> : <div className="card-art-skeleton" aria-label={`Loading ${item.name} card art`} />}{cardArt?.status === 'fallback' && <p className="tcg-unavailable">TCG artwork unavailable</p>}<h2>{item.name}</h2><div className="type-pills"><span className="type-pill">{type}</span></div><div className="card-actions"><button className="expand-button" aria-label={`Expand ${item.name} card`} onClick={() => openLightbox(item)}>⤢</button><button className={`collect-button ${collected.includes(item.id) ? 'collected' : ''}`} onClick={() => toggleCollected(item.id)}>{collected.includes(item.id) ? '✓ Collected' : '+ Collect card'}</button></div></div>
      </article>
    })}</div>}
    {lightbox && <div className="modal-backdrop lightbox-backdrop" role="presentation" onClick={() => setLightbox(null)}><div className="lightbox-modal" role="dialog" aria-modal="true" aria-label={`${lightbox.name} card image`} onClick={(event) => event.stopPropagation()}><button className="close-button" aria-label="Close enlarged card" onClick={() => setLightbox(null)}>×</button>{!art[lightbox.id] || art[lightbox.id].status === 'pending' ? <div className="lightbox-skeleton" aria-label={`Loading ${lightbox.name} card art`} /> : <>{art[lightbox.id].status === 'fallback' && <p className="tcg-unavailable">TCG artwork unavailable</p>}<img src={art[lightbox.id].url || fallback(lightbox)} alt={lightbox.name} /></>}<button className={`collect-button ${collected.includes(lightbox.id) ? 'collected' : ''}`} onClick={() => toggleCollected(lightbox.id)}>{collected.includes(lightbox.id) ? '✓ Collected' : '+ Collect card'}</button></div></div>}
  </main>
}
