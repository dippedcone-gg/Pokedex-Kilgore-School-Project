import { STATS } from "../pokemonHelpers"

// Any base stat higher than this would fill the whole bar, so we use it as the
// scale. The API's numbers go up to about 200.
const MAX_STAT = 255

// The six base stats drawn as bars. The sixth one is the sum, which is the
// number people use to compare how strong a Pokemon is overall.
export default function StatBars({ stats }) {
  const total = stats.reduce((sum, entry) => sum + entry.base_stat, 0)

  return (
    <section className="panel">
      <h3 className="panel__title">
        Base Stats
        <span className="panel__note">total {total}</span>
      </h3>

      <ul className="stats">
        {STATS.map(({ key, label }) => {
          const entry = stats.find((stat) => stat.stat.name === key)
          const value = entry ? entry.base_stat : 0

          return (
            <li className="stats__row" key={key}>
              <span className="stats__label">{label}</span>
              <span className="stats__track">
                <span
                  className={`stats__fill stat-${key}`}
                  style={{ width: `${Math.min(100, (value / MAX_STAT) * 100)}%` }}
                />
              </span>
              <span className="stats__value">{value}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
