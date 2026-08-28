import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const pretty = (value) => value.replace('-', ' ')
export default function PokemonDetail({ pokemon, onClose }) {
  const [species, setSpecies] = useState(null)
  const [evolution, setEvolution] = useState(null)
  useEffect(() => {
    let active = true
    fetch(pokemon.species.url).then((response) => response.json()).then((data) => {
      if (!active) return
      setSpecies(data)
      return fetch(data.evolution_chain.url)
    }).then((response) => response?.json()).then((data) => active && data && setEvolution(data.chain)).catch(() => {})
    return () => { active = false }
  }, [pokemon])
  const chainNames = []
  const walk = (node) => { if (node) { chainNames.push(node.species.name); node.evolves_to?.forEach(walk) } }
  walk(evolution)
  return createPortal(<div className="modal-backdrop" onClick={onClose}><section className="detail-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
    <button className="close-button" onClick={onClose} aria-label="Close details">×</button>
    <div className="detail-heading"><div><span className="dex-number">#{String(pokemon.id).padStart(3, '0')}</span><h2>{pokemon.name}</h2><div className="type-pills">{pokemon.types.map(({ type }) => <span className={`type-pill type-${type.name}`} key={type.name}>{type.name}</span>)}</div></div><img src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} alt={pokemon.name} /></div>
    {species && <p className="flavor">{species.flavor_text_entries.find((entry) => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ')}</p>}
    <div className="detail-facts"><div><small>Height</small><strong>{(pokemon.height / 10).toFixed(1)} m</strong></div><div><small>Weight</small><strong>{(pokemon.weight / 10).toFixed(1)} kg</strong></div><div><small>Abilities</small><strong>{pokemon.abilities.map((item) => pretty(item.ability.name)).join(', ')}</strong></div></div>
    <h3>Base stats <span>{pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)} total</span></h3><div className="stat-list">{pokemon.stats.map((stat) => <div className="stat-row" key={stat.stat.name}><label>{pretty(stat.stat.name)}</label><div><i style={{ width: `${Math.min(stat.base_stat / 2.55, 100)}%` }} /></div><b>{stat.base_stat}</b></div>)}</div>
    {chainNames.length > 1 && <><h3>Evolution family</h3><div className="evolution-row">{chainNames.map((name, index) => <span key={name}><b>{name}</b>{index < chainNames.length - 1 && <em>→</em>}</span>)}</div></>}
  </section></div>, document.body)
}
