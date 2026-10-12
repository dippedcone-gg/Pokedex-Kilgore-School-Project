// Small helpers that turn the raw API data into text we can show on screen.
// They are plain functions: give something in, get a string back.

// PokeAPI stores sprites as files named after the Pokemon number.
const SPRITE_FOLDER = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

// The 18 classic types, in the order we want the filter buttons to appear.
export const TYPE_NAMES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
]

// The base stats every Pokemon has, in the order they are usually listed.
export const STATS = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "special-attack", label: "Sp. Atk" },
  { key: "special-defense", label: "Sp. Def" },
  { key: "speed", label: "Speed" },
]

// A handful of names look wrong if we just capitalise them.
const SPECIAL_NAMES = {
  "nidoran-f": "Nidoran ♀",
  "nidoran-m": "Nidoran ♂",
  "mr-mime": "Mr. Mime",
  "mr-rime": "Mr. Rime",
  "farfetchd": "Farfetch'd",
  "sirfetchd": "Sirfetch'd",
  "ho-oh": "Ho-Oh",
  "porygon-z": "Porygon-Z",
  "type-null": "Type: Null",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  "wo-chien": "Wo-Chien",
  "chien-pao": "Chien-Pao",
  "ting-lu": "Ting-Lu",
  "great-tusk": "Great Tusk",
  "iron-hands": "Iron Hands",
  "iron-leaves": "Iron Leaves",
  "roaring-moon": "Roaring Moon",
  "iron-vines": "Iron Vines",
  "walking-wake": "Walking Wake",
  "gouging-fire": "Gouging Fire",
  "raging-bolt": "Raging Bolt",
  "deoxys-normal": "Deoxys",
  "deoxys-attack": "Deoxys (Attack Forme)",
  "deoxys-defense": "Deoxys (Defense Forme)",
  "deoxys-speed": "Deoxys (Speed Forme)",
  "giratina-altered": "Giratina",
  "shaymin-land": "Shaymin",
  "shaymin-sky": "Shaymin (Sky Forme)",
  "basculin-red-striped": "Basculin (Red-Striped)",
  "tornadus-incarnate": "Tornadus",
  "thundurus-incarnate": "Thundurus",
  "landorus-incarnate": "Landorus",
  "meloetta-aria": "Meloetta (Aria Forme)",
  "meloetta-pirouette": "Meloetta (Pirouette Forme)",
  "aegislash-shield": "Aegislash",
  "zygarde-10": "Zygarde (10% Forme)",
  "pumpkaboo-super": "Pumpkaboo",
  "gourgeist-super": "Gourgeist",
}

// "charmander" -> "Charmander",  "charizard-mega-x" -> "Charizard Mega X"
export function formatName(name) {
  if (SPECIAL_NAMES[name]) return SPECIAL_NAMES[name]
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// The API measures height in decimetres and weight in hectograms.
export function formatHeight(decimetres) {
  return `${(decimetres / 10).toFixed(1)} m`
}

export function formatWeight(hectograms) {
  return `${(hectograms / 10).toFixed(1)} kg`
}

const ROMAN_NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"]

// "generation-iv" -> "Generation 4"
export function formatGeneration(generationName) {
  const roman = generationName.replace("generation-", "")
  const index = ROMAN_NUMERALS.indexOf(roman)
  if (index === -1) return generationName
  return `Generation ${index + 1}`
}

// The species endpoint lists a flavour text for every language and every game
// version. We just want the most recent English one.
export function getFlavorText(species) {
  const englishEntries = species.flavor_text_entries.filter(
    (entry) => entry.language.name === "en",
  )
  const newest = englishEntries[englishEntries.length - 1]
  if (!newest) return ""
  return newest.flavor_text.replace(/[\n\f]/g, " ")
}

// Same idea for the one-line description, like "Flame Pokemon".
export function getGenus(species) {
  const entry = species.genera.find((item) => item.language.name === "en")
  return entry ? entry.genus : ""
}

// A Pokemon's list of moves is huge (130+). Each move tells us which level it
// is learned at, so we keep the lowest level to show as "Lv. 12".
export function getMoveLevel(move) {
  const levels = move.version_group_details
    .filter((detail) => detail.level_learned_at > 0)
    .map((detail) => detail.level_learned_at)
  if (levels.length === 0) return null
  return Math.min(...levels)
}

// Small sprite for the cards.
export function getCardSprite(pokemon) {
  return pokemon.sprites.front_default
}

// Big picture for the detail view, with a fallback for Pokemon that have none.
export function getArtwork(pokemon) {
  return (
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default
  )
}

// The evolution chain gives us species links like
// ".../pokemon-species/4/", and sprite files use that same number.
export function getSpriteFromSpeciesUrl(speciesUrl) {
  const number = speciesUrl.split("/").filter(Boolean).pop()
  return `${SPRITE_FOLDER}/${number}.png`
}

// Turn one evolution step into words, like "Lv. 16" or "use Thunder Stone".
export function describeEvolution(evolutionDetails) {
  // Some Pokemon have several ways to evolve (Leafeon can use a Leaf Stone or
  // level up in a forest). The API marks the usual one with is_default: true.
  const detail = evolutionDetails.find((entry) => entry.is_default) || evolutionDetails[0]
  if (!detail) return ""

  if (detail.min_level) return `Lv. ${detail.min_level}`
  if (detail.item) return `use ${formatName(detail.item.name)}`
  if (detail.held_item) return `holding ${formatName(detail.held_item.name)}`
  if (detail.known_move) return `knowing ${formatName(detail.known_move.name)}`
  if (detail.min_happiness) {
    const extra = detail.known_move_type ? ` + ${detail.known_move_type.name} move` : ""
    return `high friendship${extra}`
  }
  if (detail.min_affection) return "high affection"
  if (detail.time_of_day) return `${formatName(detail.time_of_day)} level up`
  if (detail.location) return `at ${formatName(detail.location.name)}`
  if (detail.turn_upside_down) return "holding a stick upside down"
  if (detail.gender === 1) return "female"
  if (detail.gender === 2) return "male"
  if (detail.trigger.name === "trade") return "traded"
  if (detail.trigger.name === "shed") return "an empty slot"

  return formatName(detail.trigger.name)
}

// The evolution chain is nested: each Pokemon holds the ones it turns into.
// This flattens it into a simple list we can map over, keeping the condition
// ("Lv. 16") with the Pokemon it belongs to.
export function flattenEvolutionChain(chain, condition = "") {
  const stages = [{ name: chain.species.name, condition, url: chain.species.url }]

  for (const next of chain.evolves_to) {
    const nextStages = flattenEvolutionChain(next, describeEvolution(next.evolution_details))
    stages.push(...nextStages)
  }

  return stages
}
