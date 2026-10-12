import TypeBadge from "./TypeBadge"
import { formatName, getCardSprite } from "../lib/pokemonHelpers"

// One Pokemon in the grid. Clicking it opens the detail view.
export default function PokemonCard({ pokemon, onSelect }) {
  const types = pokemon.types.map((entry) => entry.type.name)
  const number = String(pokemon.id).padStart(3, "0")

  return (
    <button className="card" onClick={() => onSelect(pokemon.name)}>
      <span className="card__number">#{number}</span>
      <img className="card__sprite" src={getCardSprite(pokemon)} alt="" loading="lazy" />
      <span className="card__name">{formatName(pokemon.name)}</span>
      <span className="card__types">
        {types.map((type) => (
          <TypeBadge key={type} name={type} />
        ))}
      </span>
    </button>
  )
}
