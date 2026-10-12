import { formatName } from "../pokemonHelpers"

// A coloured pill showing a Pokemon type, like FIRE or GHOST.
// The colour comes from CSS: className "type-fire" sets a --type-color.
export default function TypeBadge({ name }) {
  return <span className={`type-badge type-${name}`}>{formatName(name)}</span>
}
