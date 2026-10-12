import { useEffect, useState } from "react"
import { getJson } from "../lib/api"

// Fetches a URL and hands the component three things: the data, whether it is
// still loading, and an error message if something went wrong.
//
//   const { data, loading, error } = useFetch(pokemonUrl("ditto"))
//
// Pass null when there is nothing to load and no request is made.
//
// How it works: the downloaded data is stored together with the URL it came
// from. When the URL changes the old data no longer matches, so we report
// "loading" until the new answer arrives. That is why we never have to clear
// the data by hand inside the effect.
export function useFetch(url) {
  const [result, setResult] = useState({ url: null, data: null, error: null })

  const isCurrent = result.url === url

  useEffect(() => {
    if (!url) return

    let cancelled = false

    getJson(url).then(
      (data) => {
        if (!cancelled) setResult({ url, data, error: null })
      },
      (error) => {
        if (!cancelled) setResult({ url, data: null, error: error.message })
      },
    )

    // React runs effects twice in development, so we mark the first run as
    // cancelled instead of letting an old answer overwrite a newer one.
    return () => {
      cancelled = true
    }
  }, [url])

  if (!url) {
    return { data: null, loading: false, error: null }
  }

  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    loading: !isCurrent,
  }
}
