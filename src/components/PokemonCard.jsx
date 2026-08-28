const typeColors = { normal: '#a8a77a', fire: '#ee8130', water: '#6390f0', electric: '#f7d02c', grass: '#7ac74c', ice: '#96d9d6', fighting: '#c22e28', poison: '#a33ea1', ground: '#e2bf65', flying: '#a98ff3', psychic: '#f95587', bug: '#a6b91a', rock: '#b6a136', ghost: '#735797', dragon: '#6f35fc', dark: '#705746', steel: '#b7b7ce', fairy: '#d685ad' }

export default function PokemonCard({ pokemon, favorite, onFavorite, onSelect }) {
  return <article className="pokemon-card" style={{ '--type-color': typeColors[pokemon.types[0].type.name] }}>
    <button className="card-main" onClick={() => onSelect(pokemon)} aria-label={`View ${pokemon.name} details`}>
      <span className="dex-number">#{String(pokemon.id).padStart(3, '0')}</span>
      <img src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} alt={pokemon.name} loading="lazy" />
      <h2>{pokemon.name}</h2><div className="type-pills">{pokemon.types.map(({ type }) => <span className={`type-pill type-${type.name}`} key={type.name}>{type.name}</span>)}</div>
      <span className="view-details">View details <span>↗</span></span>
    </button>
    <button className={`favorite-button ${favorite ? 'selected' : ''}`} onClick={onFavorite} aria-label={`${favorite ? 'Remove' : 'Add'} ${pokemon.name} ${favorite ? 'from' : 'to'} favorites`}>♥</button>
  </article>
}
