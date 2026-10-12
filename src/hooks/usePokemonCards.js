import { useEffect, useState } from "react"
import { getPokemon } from "../lib/api"

// Loads the full details for a page of Pokemon names. The list endpoints only
// give us names, so we download every Pokemon in parallel and hand back the
// whole array at once.
//
// The downloaded Pokemon are stored together with the names they belong to, the
// same idea as useFetch. Comparing the names as one string works even when we
// get a brand new array.
export function usePokemonCards(names) {
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

  return {
    pokemon: isCurrent ? result.pokemon : [],
    error: isCurrent ? result.error : null,
    loading: !isCurrent && names.length > 0,
  }
}
