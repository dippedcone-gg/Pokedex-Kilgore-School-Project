import { useState } from "react"

// The search box. The API is happy to look up a Pokemon by name ("pikachu")
// or by number ("25"), so one input handles both.
export default function SearchBar({ onSearch, onRandom, error }) {
  const [text, setText] = useState("")

  function handleSubmit(event) {
    // Stop the form from reloading the page.
    event.preventDefault()
    if (text.trim()) onSearch(text.trim().toLowerCase())
  }

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="pokemon-search">
        Search Pokemon by name or number
      </label>
      <input
        className="search__input"
        id="pokemon-search"
        type="search"
        value={text}
        placeholder="Search a name or number..."
        onChange={(event) => setText(event.target.value)}
      />
      <button className="btn btn--primary" type="submit">
        Search
      </button>
      <button className="btn" type="button" onClick={onRandom}>
        Random
      </button>
      {error && (
        <p className="message message--error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
