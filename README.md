<h1 align="center">Pokédex</h1>

<p align="center"><b>Gotta fetch 'em all.</b></p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white">
  <img alt="PokeAPI" src="https://img.shields.io/badge/data-PokeAPI-EE1515">
  <img alt="No API key" src="https://img.shields.io/badge/API%20key-not%20required-2EA043">
</p>

A retro handheld Pokédex for the browser. Browse all **1,025 Pokémon**, filter by type, search by name or number, and open a full profile — stats, type matchups, evolutions, moves, sprites and cries.

Built with **React + Vite** and powered by the free [PokeAPI](https://pokeapi.co). No sign-up, no API key.

---

## ▸ Quick start

```bash
npm install     # install dependencies
npm run dev     # start the dev server
```

Then open **http://localhost:5173** and start scanning.

## ▸ Controls

| Action         | What it does                                           |
| -------------- | ------------------------------------------------------ |
| **Search**     | Look up a Pokémon by name (`pikachu`) or number (`25`) |
| **Random**     | Jump to a surprise Pokémon                             |
| **Type chips** | Filter the grid by type — tap again to clear           |
| **A card**     | Open the full profile — press `Esc` to close it        |

## ▸ What's inside a profile

Artwork & sprites · types · base stats · type matchups · evolution chain · moves · abilities · height, weight, generation, habitat, catch rate · flavor text · and the Pokémon's cry.

## ▸ Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start Vite with hot reload       |
| `npm run build`        | Build for production to `dist/`  |
| `npm run preview`      | Preview the production build     |
| `npm run lint`         | Run ESLint                       |
| `npm run format`       | Format the code with Prettier    |
| `npm run format:check` | Check formatting without writing |

## ▸ Project structure

```
src/
├─ App.jsx            # shell: grid, filters and detail panel
├─ main.jsx           # app entry point
├─ index.css          # the Pokédex device styles
├─ hooks/             # reusable data-loading hooks
│  ├─ useFetch.js
│  ├─ usePokemonList.js
│  └─ usePokemonCards.js
├─ lib/               # PokeAPI calls + formatting helpers
│  ├─ api.js
│  └─ pokemonHelpers.js
└─ components/        # cards, search, types, stats, evolutions, moves…
```

---

<p align="center"><sub>Data from <a href="https://pokeapi.co">PokeAPI</a> · A Kilgore school project · Built for learning React.</sub></p>
