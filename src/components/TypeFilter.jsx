import { TYPE_NAMES } from "../lib/pokemonHelpers"

// The row of type buttons under the search box. Clicking the active type again
// clears the filter.
export default function TypeFilter({ activeType, onSelect }) {
  return (
    <div className="type-filter" role="group" aria-label="Filter by type">
      {TYPE_NAMES.map((name) => (
        <button
          key={name}
          className={`chip type-${name} ${activeType === name ? "chip--active" : ""}`}
          aria-pressed={activeType === name}
          onClick={() => onSelect(name)}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
