import { useMemo } from "react"
import { useFetch } from "./useFetch"

// Loads a list of Pokemon names and tidies up the two shapes the API uses.
//
//   /pokemon?limit=20&offset=0  ->  { count, results: [{ name, url }] }
//   /type/fire                 ->  { pokemon: [{ slot, pokemon: { name, url } }] }
//
// Notice that the type endpoint buries the name one level deeper. Both come
// back as the same simple value:
//
//   { names: ["bulbasaur", "ivysaur", ...], total: 1351 }
//
export function usePokemonList(url) {
  const request = useFetch(url)

  const data = useMemo(() => {
    const response = request.data
    if (!response) return null

    if (response.results) {
      return { names: response.results.map((entry) => entry.name), total: response.count }
    }
    if (response.pokemon) {
      return {
        names: response.pokemon.map((entry) => entry.pokemon.name),
        total: response.pokemon.length,
      }
    }
    return { names: [], total: 0 }
  }, [request.data])

  return { ...request, data }
}
