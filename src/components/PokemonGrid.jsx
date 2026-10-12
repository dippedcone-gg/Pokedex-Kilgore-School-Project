import { usePokemonCards } from "../hooks/usePokemonCards"
import PokemonCard from "./PokemonCard"

const PLACEHOLDER_COUNT = 10

// One page of Pokemon, shown as a grid of cards. The details for the current
// page are loaded by usePokemonCards.
export default function PokemonGrid({ names, onSelect }) {
  const { pokemon, error } = usePokemonCards(names)

  if (names.length === 0) {
    return (
      <p className="message" role="status">
        No Pokemon to show here.
      </p>
    )
  }

  if (error) {
    return <p className="message message--error">Could not load the list: {error}</p>
  }

  return (
    <ul className="grid">
      {pokemon.length === 0
        ? Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
            <li className="grid__item" key={index} aria-hidden="true">
              <div className="card card--loading" />
            </li>
          ))
        : pokemon.map((entry) => (
            <li className="grid__item" key={entry.id}>
              <PokemonCard pokemon={entry} onSelect={onSelect} />
            </li>
          ))}
    </ul>
  )
}
