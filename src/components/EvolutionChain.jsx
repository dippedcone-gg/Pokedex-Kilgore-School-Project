import { useFetch } from "../hooks/useFetch"
import { flattenEvolutionChain, formatName, getSpriteFromSpeciesUrl } from "../lib/pokemonHelpers"

// The family tree, e.g. Charmander -> Charmeleon -> Charizard.
// We pass in the URL because only the species data knows which chain to use.
export default function EvolutionChain({ chainUrl }) {
  const { data, loading, error } = useFetch(chainUrl)

  if (loading) return <p className="panel__status">Loading evolution chain...</p>
  if (error) return <p className="panel__status">Could not load the evolution chain.</p>

  const stages = flattenEvolutionChain(data.chain)

  // A Pokemon that never evolves has itself and nothing else.
  if (stages.length < 2) {
    return (
      <section className="panel">
        <h3 className="panel__title">Evolution</h3>
        <p className="panel__note">This Pokemon does not evolve.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <h3 className="panel__title">Evolution</h3>

      <ol className="evolutions">
        {stages.map((stage, index) => (
          <li className="evolution" key={index}>
            <img
              className="evolution__sprite"
              src={getSpriteFromSpeciesUrl(stage.url)}
              alt=""
              loading="lazy"
            />
            <span className="evolution__name">{formatName(stage.name)}</span>
            {stage.condition && <span className="evolution__condition">{stage.condition}</span>}
          </li>
        ))}
      </ol>
    </section>
  )
}
