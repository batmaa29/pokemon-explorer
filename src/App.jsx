import PokemonList from './components/PokemonList'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-12">
      <h1 className="text-3xl md:text-4xl font-bold text-yellow-300/90 text-center mb-8">
        Pokémon Explorer
      </h1>

      <div className="max-w-6xl mx-auto">
        <PokemonList />
      </div>
    </div>
  )
}

export default App