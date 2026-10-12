import { useEffect } from "react"
import { pokemonUrl, speciesUrl } from "../api"
import { useFetch } from "../useFetch"
import {
  formatGeneration,
  formatHeight,
  formatName,
  formatWeight,
  getArtwork,
  getFlavorText,
  getGenus,
} from "../pokemonHelpers"
import TypeBadge from "./TypeBadge"
import StatBars from "./StatBars"
import TypeMatchup from "./TypeMatchup"
import EvolutionChain from "./EvolutionChain"
import MoveList from "./MoveList"

// The full profile of one Pokemon, shown as a panel over the grid.
// `name` is just a name like "charizard" -- each part below loads its own data.
export default function PokemonDetail({ name, onClose }) {
  const pokemon = useFetch(pokemonUrl(name))

  // Most Pokemon have their own species page. Forms such as "charizard-mega-x"
  // do not, so we ask for the base name ("charizard") as a second chance and
  // use whichever answer we get.
  const baseName = name.split("-")[0]
  const species = useFetch(speciesUrl(name))
  const baseSpecies = useFetch(name === baseName ? null : speciesUrl(baseName))
  const speciesData = species.data ?? baseSpecies.data

  // Press Escape to close, like most dialogs.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="detail"
        role="dialog"
        aria-modal="true"
        aria-label={formatName(name)}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="detail__close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {pokemon.loading && <p className="message">Scanning...</p>}
        {pokemon.error && <p className="message message--error">Could not load {name}.</p>}
        {pokemon.data && <Facts pokemon={pokemon.data} species={speciesData} />}
      </div>
    </div>
  )
}

// Everything inside the panel. Split in two so each half stays readable:
// the profile on the left, the lists on the right.
function Facts({ pokemon, species }) {
  const types = pokemon.types.map((entry) => entry.type.name)
  const number = `#${String(pokemon.id).padStart(3, "0")}`

  const facts = [
    ["Height", formatHeight(pokemon.height)],
    ["Weight", formatWeight(pokemon.weight)],
    ["Base exp.", pokemon.base_experience ?? "None"],
    ["Genus", species ? getGenus(species) : null],
    ["Generation", species ? formatGeneration(species.generation.name) : null],
    ["Habitat", species ? formatName(species.habitat?.name || "unknown") : null],
    ["Catch rate", species ? `${species.capture_rate} / 255` : null],
  ]

  const sprites = [
    pokemon.sprites.front_default,
    pokemon.sprites.back_default,
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
  ].filter(Boolean)

  const flavorText = species ? getFlavorText(species) : ""

  return (
    <div className="detail__body">
      <div className="profile">
        <p className="profile__number">{number}</p>
        <img className="profile__art" src={getArtwork(pokemon)} alt={formatName(pokemon.name)} />

        <h2 className="profile__name">{formatName(pokemon.name)}</h2>

        <div className="profile__types">
          {types.map((type) => (
            <TypeBadge key={type} name={type} />
          ))}
        </div>

        <div className="profile__badges">
          {species?.is_legendary && <span className="badge badge--gold">Legendary</span>}
          {species?.is_mythical && <span className="badge badge--gold">Mythical</span>}
          {species?.is_baby && <span className="badge">Baby</span>}
        </div>

        <dl className="facts">
          {facts.map(([label, value]) => (
            <div className="facts__row" key={label}>
              <dt className="facts__label">{label}</dt>
              <dd className="facts__value">{value ?? "..."}</dd>
            </div>
          ))}
        </dl>

        <h3 className="facts__heading">Abilities</h3>
        <ul className="tags">
          {pokemon.abilities.map(({ ability, is_hidden }) => (
            <li className="tag" key={ability.name}>
              {formatName(ability.name)}
              {is_hidden && " (hidden)"}
            </li>
          ))}
        </ul>

        <h3 className="facts__heading">Sprites</h3>
        <div className="sprites">
          {sprites.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`${formatName(pokemon.name)} sprite ${index + 1}`}
              loading="lazy"
            />
          ))}
        </div>

        {flavorText && <p className="flavor">{flavorText}</p>}

        {pokemon.cries?.latest && (
          <audio className="cry" controls preload="none" src={pokemon.cries.latest} />
        )}
      </div>

      <div className="detail__lists">
        <StatBars stats={pokemon.stats} />

        {types.map((type) => (
          <TypeMatchup key={type} type={type} />
        ))}

        {species?.evolution_chain && <EvolutionChain chainUrl={species.evolution_chain.url} />}

        <MoveList moves={pokemon.moves} />
      </div>
    </div>
  )
}
