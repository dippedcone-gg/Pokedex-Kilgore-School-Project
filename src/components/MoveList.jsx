import { formatName, getMoveLevel } from "../lib/pokemonHelpers"

// A Pokemon knows 100+ moves, which is too many to show at once, so we put them
// in a box that scrolls. "Lv." is the earliest level the Pokemon learns it.
export default function MoveList({ moves }) {
  // Sort a copy so we do not change the array that came from the API.
  const sorted = [...moves].sort((first, second) => {
    const firstLevel = getMoveLevel(first) ?? 999
    const secondLevel = getMoveLevel(second) ?? 999
    return firstLevel - secondLevel
  })

  return (
    <section className="panel">
      <h3 className="panel__title">
        Moves
        <span className="panel__note">{moves.length} known</span>
      </h3>

      <ul className="moves">
        {sorted.map((entry) => {
          const level = getMoveLevel(entry)

          return (
            <li className="move" key={entry.move.name}>
              <span className="move__level">{level ? `Lv. ${level}` : "--"}</span>
              <span className="move__name">{formatName(entry.move.name)}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
