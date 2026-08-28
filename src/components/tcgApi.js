const TCG_API = 'https://api.pokemontcg.io/v2/cards'
const TCGDEX_API = 'https://api.tcgdex.net/v2/en/cards'
const REQUEST_TIMEOUT = 5000
const MAX_RETRIES = 1
const RETRY_DELAYS = [300]

// PokeAPI uses URL-safe names while the card API uses the printed names.
export function normalizeTcgName(name) {
  const normalized = name.toLowerCase().trim()
    .replace(/nidoran[- ]f\b/g, 'nidoran♀')
    .replace(/nidoran[- ]m\b/g, 'nidoran♂')
    .replace(/\bfarfetchd\b/g, "farfetch'd")
    .replace(/\bmr[- ]mime\b/g, 'mr. mime')
    .replace(/-/g, ' ')
  return normalized.replace(/\s+/g, ' ')
}

export function buildTcgQuery(name) {
  return `name:${normalizeTcgName(name)}`
}

const queryNames = (name, dexNumber) => [
  `nationalPokedexNumbers:${dexNumber}`,
  `name:${normalizeTcgName(name)}`,
]

async function requestArt(query) {
  const url = new URL(TCG_API)
  url.search = new URLSearchParams({ q: query, pageSize: '20' }).toString()
  let lastError
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) {
        lastError = new Error(`TCG API request failed (${response.status})`)
        if (response.status < 500 || response.status > 599) break
        if (attempt < MAX_RETRIES) await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]))
        continue
      }
      const data = await response.json()
      const card = data.data?.find((entry) => entry?.id)
      if (!card) return { status: 'empty', reason: 'no matching card' }
      const url = card.images?.large
        || card.images?.small
        || `https://images.pokemontcg.io/${encodeURIComponent(card.id)}/large.png`
      return { status: 'ready', url, cardId: card.id }
    } catch (error) {
      lastError = error.name === 'AbortError' ? new Error(`request timed out after ${REQUEST_TIMEOUT}ms`) : error
      if (attempt < MAX_RETRIES) await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]))
    } finally {
      clearTimeout(timeout)
    }
  }
  return { status: 'error', reason: lastError?.message || 'request failed' }
}

function cardImageUrl(image) {
  if (!image) return null
  if (/\/(high|low)\.png(?:\?.*)?$/i.test(image)) return image
  return `${image.replace(/\/+$/, '')}/high.png`
}

function tcgdexNames(name) {
  const normalized = normalizeTcgName(name)
  const aliases = {
    'nidoran♀': ['nidoran♀', 'nidoran f'],
    'nidoran♂': ['nidoran♂', 'nidoran m'],
    "farfetch'd": ["farfetch'd", 'farfetchd'],
    'mr. mime': ['mr. mime', 'mr mime'],
  }
  return aliases[normalized] || [normalized]
}

async function requestTcgdex(name) {
  let lastReason = 'no matching card'
  for (const searchName of tcgdexNames(name)) {
    const url = new URL(TCGDEX_API)
    url.search = new URLSearchParams({ name: searchName }).toString()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) {
        lastReason = `TCGdex request failed (${response.status})`
        continue
      }
      const cards = await response.json()
      const card = Array.isArray(cards) ? cards.find((entry) => entry?.image) : null
      if (card) {
        return { status: 'ready', url: cardImageUrl(card.image), cardId: card.id }
      }
      lastReason = 'no matching card with artwork'
    } catch (error) {
      lastReason = error.name === 'AbortError' ? `TCGdex request timed out after ${REQUEST_TIMEOUT}ms` : error.message
    } finally {
      clearTimeout(timeout)
    }
  }
  return { status: 'error', reason: lastReason }
}

export async function fetchCardArt(name, dexNumber) {
  const queries = queryNames(name, dexNumber)
  let reason = 'no matching card'
  for (const query of queries) {
    const result = await requestArt(query)
    if (result.status === 'ready') return result
    reason = result.reason
    if (result.status === 'error') break
  }
  const tcgdexResult = await requestTcgdex(name)
  if (tcgdexResult.status === 'ready') return tcgdexResult
  reason = tcgdexResult.reason
  console.warn(`Using PokeAPI fallback art for ${name}: ${reason}`)
  return { status: 'fallback', url: null, reason }
}
