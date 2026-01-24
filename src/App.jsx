import { useState } from 'react'
import PokemonList from './components/PokemonList'

function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [initialType, setInitialType] = useState(null)

  const handleTypeSelect = (type) => {
    setInitialType(type)
    setShowWelcome(false)
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Pokémon Balls */}
        <div className="absolute top-16 left-16 w-10 h-10 md:w-14 md:h-14 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')] bg-contain animate-bounce opacity-40"></div>
        <div className="absolute top-16 right-16 w-10 h-10 md:w-14 md:h-14 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')] bg-contain animate-spin opacity-35"></div>
        <div className="absolute bottom-16 left-16 w-10 h-10 md:w-14 md:h-14 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')] bg-contain animate-pulse opacity-45"></div>
        <div className="absolute bottom-16 right-16 w-10 h-10 md:w-14 md:h-14 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')] bg-contain animate-bounce opacity-40"></div>
        
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')] bg-contain animate-spin opacity-35"></div>
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')] bg-contain animate-pulse opacity-40"></div>
        
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-9 h-9 md:w-13 md:h-13 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')] bg-contain animate-bounce opacity-30"></div>
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-9 h-9 md:w-13 md:h-13 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png')] bg-contain animate-spin opacity-35"></div>
        
        <div className="text-center relative z-10 bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-4xl mx-auto shadow-2xl border border-yellow-300/20">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-300 mb-8 animate-pulse">
            Welcome to Pokémon Explorer
          </h1>
          <div className="text-lg md:text-xl text-white mb-12 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-yellow-200">Discover the World of Pokémon</h2>
            <p className="leading-relaxed">Pokémon are incredible creatures that inhabit our world as friends and partners.</p>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-yellow-200">What You Can Explore</h2>
            <ul className="text-left list-disc list-inside space-y-2">
              <li>Browse through hundreds of Pokémon from the official Pokédex</li>
              <li>Learn about their types, abilities, and stats</li>
              <li>Search for your favorite Pokémon by name</li>
              <li>Filter by type to find specific categories</li>
            </ul>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-yellow-200">Perfect For Everyone</h2>
            <p className="leading-relaxed">Whether you're a longtime trainer or just curious about these amazing creatures, start your adventure!</p>
          </div>
        </div>

        <button
          onClick={() => handleTypeSelect(null)}
          className="mt-8 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105"
        >
          Explore All Pokémon
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-sm md:text-4xl font-bold text-yellow-300/90">
          Pokémon Explorer
        </h1>
        <button
          onClick={() => setShowWelcome(true)}
          className="fixed top-4 right-4 md:relative md:top-auto md:right-auto z-[100] px-2 py-1 text-xs md:px-4 md:py-2 md:text-base bg-slate-700 hover:bg-slate-600 text-white rounded"
        >
          Back to Welcome
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <PokemonList initialType={initialType} />
      </div>
    </div>
  )
}

export default App