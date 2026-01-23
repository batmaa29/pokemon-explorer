# Pokémon Explorer

A modern web application built with React and Tailwind CSS that allows users to explore Pokémon using the public PokéAPI. Browse, search, filter, and view detailed information about Pokémon with a clean, responsive interface.

## Features

### Core Features
- **Browse Pokémon**: Display Pokemon with images and names in a responsive grid layout
- **Search Functionality**: Search Pokemon by name with partial matching support
- **Load More**: Paginated loading of Pokemon (50 at a time, up to 200 total)
- **Detailed View**: Click any Pokemon to view comprehensive details including:
  - Types
  - Abilities
  - Base stats with animated progress bars
  - Description from Pokemon species data

### Advanced Features
- **Type Filtering**: Filter Pokemon by all 18 types (Normal, Fire, Water, Grass, Flying, Fighting, Poison, Electric, Ground, Rock, Psychic, Ice, Bug, Ghost, Steel, Dragon, Dark, Fairy)
- **Responsive Design**: Optimized for both mobile and desktop devices
- **Smooth Animations**: Animated stat bars and modal transitions
- **Clean UI**: Modern design with Tailwind CSS styling

## How to Run

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone <your-repo-url>
cd pokemon-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Design & Technical Decisions

### Architecture
- **Component Structure**: Modular components (`PokemonList`, `PokemonCard`, `PokemonDetail`) for maintainability
- **State Management**: React hooks for local state management
- **API Integration**: Direct API calls to PokéAPI endpoints without additional libraries

### Data Fetching
- **Pokemon List**: Uses `/pokemon?limit=50&offset=0` for paginated loading
- **Pokemon Details**: Fetches individual Pokemon data from `/pokemon/{id}`
- **Species Data**: Retrieves descriptions from `/pokemon-species/{id}`
- **Search**: Pre-loads all Pokemon names for fast partial matching
- **Type Filtering**: Client-side filtering of loaded Pokemon data

### UI/UX Decisions
- **Responsive Grid**: 2 columns on mobile, 3 on tablets, 5 on desktop
- **Modal Design**: Centered modal with white background for better readability
- **Type Buttons**: Collapsible type filter with "More/Less" toggle
- **Animations**: CSS transitions for stat bars and modal appearance
- **Color Scheme**: Dark theme with yellow accents matching Pokemon branding

### Performance Optimizations
- **Lazy Loading**: Load Pokemon in batches to improve initial load time
- **Image Optimization**: Uses Pokemon API sprites for consistent sizing
- **Efficient Filtering**: Client-side filtering avoids additional API calls

### Technologies Used
- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS v4**: Utility-first CSS framework
- **PokéAPI**: Public Pokemon data API

## Project Structure

```
src/
├── components/
│   ├── PokemonCard.jsx      # Individual Pokemon card component
│   ├── PokemonDetail.jsx    # Detailed Pokemon modal
│   └── PokemonList.jsx      # Main list and search interface
├── App.jsx                  # Main application component
├── main.jsx                 # Application entry point
└── index.css                # Global styles and Tailwind imports
```

## Future Enhancements

- Add Pokemon evolution chains
- Implement favorite Pokemon functionality
- Add comparison feature for multiple Pokemon
- Include Pokemon moves and learnsets
- Add offline support with service workers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
