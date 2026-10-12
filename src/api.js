// Every request to PokeAPI is built here, so the rest of the app never has to
// know a URL. PokeAPI is free and needs no key.
//
// There are two ways to use this file:
//
//   1. Build a URL with one of the helpers below and hand it to useFetch(url),
//      so the data loads automatically when the URL changes.
//   2. Call getPokemon(name) yourself when you want the data as a promise,
//      for example after a button click.

export const API_BASE = "https://pokeapi.co/api/v2"

// How many Pokemon we show per page of the grid.
export const PAGE_SIZE = 20

// The National Dex numbers run from 1 to 1025 with no gaps, so any of them is
// a Pokemon we can open. (The /pokemon list has 1351 entries because it also
// includes alternate forms, and those have much larger ids, so we cannot use
// that count as a number to pick at random.)
export const NATIONAL_DEX_SIZE = 1025

// URL builders. Each one takes the smallest thing you need: a name or a number.
export const pokemonUrl = (nameOrNumber) => `${API_BASE}/pokemon/${nameOrNumber}`
export const speciesUrl = (name) => `${API_BASE}/pokemon-species/${name}`
export const typeUrl = (name) => `${API_BASE}/type/${name}`
export const listUrl = (limit, offset) => `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`

// A cache is a box of things we already downloaded. Without it we would ask for
// the same Pokemon over and over every time you clicked around. We store the
// promise (not the finished data) so that two components asking for the same URL
// at the same time still only cause one download.
const cache = new Map()

export function getJson(url) {
  if (!cache.has(url)) {
    const promise = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`The API answered with ${response.status}`)
        }
        return response.json()
      })
      .catch((error) => {
        // A failed request is not kept, so the next click can try it again.
        cache.delete(url)
        throw error
      })

    cache.set(url, promise)
  }

  return cache.get(url)
}

// GET /pokemon/charizard or GET /pokemon/6
// The big one: sprites, types, abilities, stats, moves and measurements.
export function getPokemon(nameOrNumber) {
  return getJson(pokemonUrl(nameOrNumber))
}
