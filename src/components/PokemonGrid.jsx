import { useEffect, useState } from "react"
import { getPokemon } from "../api"
import PokemonCard from "./PokemonCard"

const PLACEHOLDER_COUNT = 10

// The list endpoints only give us names, so this component downloads the full
// details for each Pokemon on the page. Promise.all waits for all of them
// before handing back the whole array.
export default function PokemonGrid({ names, onSelect }) {
  // The downloaded Pokemon are stored next to the names they belong to, the
  // same idea as useFetch. Comparing names as one string works even if we get
  // a brand new array.
  const requestKey = names.join(",")
  const [result, setResult] = useState({ key: null, pokemon: [], error: null })

  const isCurrent = result.key === requestKey

  useEffect(() => {
    if (names.length === 0) return

    let cancelled = false

    Promise.all(names.map((name) => getPokemon(name))).then(
      (pokemon) => {
        if (!cancelled) setResult({ key: requestKey, pokemon, error: null })
      },
      (error) => {
        if (!cancelled) setResult({ key: requestKey, pokemon: [], error: error.message })
      },
    )

    return () => {
      cancelled = true
    }
  }, [names, requestKey])

  if (names.length === 0) {
    return <p className="message">No Pokemon to show here.</p>
  }

  if (isCurrent && result.error) {
    return <p className="message message--error">Could not load the list: {result.error}</p>
  }

  const pokemon = isCurrent ? result.pokemon : []

  return (
    <div className="grid">
      {pokemon.length === 0
        ? Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
            <div className="card card--loading" key={index} aria-hidden="true" />
          ))
        : pokemon.map((entry) => (
            <PokemonCard key={entry.id} pokemon={entry} onSelect={onSelect} />
          ))}
    </div>
  )
}
