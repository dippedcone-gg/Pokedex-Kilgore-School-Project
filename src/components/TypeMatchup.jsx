import { typeUrl } from "../lib/api"
import { useFetch } from "../hooks/useFetch"
import { formatName } from "../lib/pokemonHelpers"
import TypeBadge from "./TypeBadge"

// One row of badges, skipped completely when the type has no matchups there.
function MatchupRow({ title, names }) {
  if (names.length === 0) return null

  return (
    <div className="matchup__row">
      <span className="matchup__label">{title}</span>
      {names.map((name) => (
        <TypeBadge key={name} name={name} />
      ))}
    </div>
  )
}

// The API sends lists like [{ name: "ground" }, { name: "rock" }].
// We only need the names.
function toNames(list) {
  return list.map((entry) => entry.name)
}

// How one of the Pokemon's types behaves in battle. Each type endpoint explains
// its own rules, so a Pokemon with two types gets two cards.
export default function TypeMatchup({ type }) {
  const { data, loading, error } = useFetch(typeUrl(type))

  if (loading) return <p className="panel__status">Loading {formatName(type)} matchups...</p>
  if (error) return <p className="panel__status">Could not load matchups.</p>

  const relations = data.damage_relations

  return (
    <section className="panel">
      <h3 className="panel__title">
        {formatName(type)} Type
        <span className="panel__note">when attacking / when hit</span>
      </h3>

      <MatchupRow title="Weak to" names={toNames(relations.double_damage_from)} />
      <MatchupRow title="Resists" names={toNames(relations.half_damage_from)} />
      <MatchupRow title="Immune to" names={toNames(relations.no_damage_from)} />
      <MatchupRow title="Hits hard" names={toNames(relations.double_damage_to)} />
      <MatchupRow title="Hits weak" names={toNames(relations.half_damage_to)} />
    </section>
  )
}
