import { useMemo, useState } from "react"
import { NATIONAL_DEX_SIZE, PAGE_SIZE, getPokemon, listUrl, typeUrl } from "./api"
import { formatName } from "./pokemonHelpers"
import { usePokemonList } from "./usePokemonList"
import PokemonGrid from "./components/PokemonGrid"
import PokemonDetail from "./components/PokemonDetail"
import SearchBar from "./components/SearchBar"
import TypeFilter from "./components/TypeFilter"

export default function App() {
  // --- What the grid is showing -------------------------------------------
  const [page, setPage] = useState(0)
  const [typeName, setTypeName] = useState(null) // null means "all types"

  // --- The detail panel ---------------------------------------------------
  const [selectedName, setSelectedName] = useState(null)
  const [searchError, setSearchError] = useState("")

  // One URL decides what the grid lists: either a page of the full list, or
  // every Pokemon with the chosen type.
  const listRequestUrl = typeName ? typeUrl(typeName) : listUrl(PAGE_SIZE, page * PAGE_SIZE)
  const list = usePokemonList(listRequestUrl)

  const names = useMemo(() => {
    if (!list.data) return []
    // A type returns its whole list at once, so we cut out one page ourselves.
    // The /pokemon endpoint already sent us exactly the page we asked for.
    if (!typeName) return list.data.names
    return list.data.names.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  }, [list.data, page, typeName])

  const total = list.data ? list.data.total : 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasPrevious = page > 0
  const hasNext = (page + 1) * PAGE_SIZE < total

  function handleTypeSelect(name) {
    // Clicking the type that is already on clears the filter.
    setTypeName((current) => (current === name ? null : name))
    setPage(0)
  }

  function handleSearch(text) {
    setSearchError("")
    // The API accepts a name or a number, and it fails for anything unknown.
    getPokemon(text)
      .then((pokemon) => setSelectedName(pokemon.name))
      .catch(() => setSearchError(`No Pokemon called "${text}".`))
  }

  function handleRandom() {
    setSearchError("")
    const number = Math.floor(Math.random() * NATIONAL_DEX_SIZE) + 1
    setSelectedName(String(number))
  }

  return (
    <div className="pokedex">
      <div className="pokedex__shell">
        <header className="pokedex__header">
          <div>
            <h1 className="pokedex__logo">Pokedex</h1>
            <p className="pokedex__sub">v2.0 &mdash; connected</p>
          </div>
          <div className="pokedex__lights" aria-hidden="true">
            <span className="light light--green" />
            <span className="light light--red" />
          </div>
        </header>

        <main className="screen">
          <div className="screen__grid" aria-hidden="true" />

          <div className="screen__content">
            <SearchBar onSearch={handleSearch} onRandom={handleRandom} error={searchError} />

            <TypeFilter activeType={typeName} onSelect={handleTypeSelect} />

            <div className="screen__status">
              {list.loading && <span>Loading Pokemon...</span>}
              {!list.loading && !list.error && (
                <span>
                  {typeName ? `${formatName(typeName)} type` : "All types"} &middot; page{" "}
                  {page + 1} of {pageCount} &middot; {total.toLocaleString()} found
                </span>
              )}
              {list.error && <span className="message--error">Could not load the list.</span>}
            </div>

            <PokemonGrid names={names} onSelect={setSelectedName} />

            <nav className="pagination">
              <button className="btn" disabled={!hasPrevious} onClick={() => setPage(page - 1)}>
                ◀ Previous
              </button>
              <button className="btn" disabled={!hasNext} onClick={() => setPage(page + 1)}>
                Next ▶
              </button>
            </nav>
          </div>
        </main>

        <footer className="pokedex__footer">
          <span className="pokedex__grille" aria-hidden="true" />
          <span className="pokedex__hinge" aria-hidden="true" />
        </footer>
      </div>

      {selectedName && (
        <PokemonDetail name={selectedName} onClose={() => setSelectedName(null)} />
      )}
    </div>
  )
}
