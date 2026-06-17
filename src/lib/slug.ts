/**
 * URL-safe slug utilities (replaces github-slugger).
 */

export function slugify(value: string): string {
  if (typeof value !== 'string') return ''
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/ /g, '-')
}

export function createSlugger() {
  const occurrences: Record<string, number> = Object.create(null)

  return {
    slug(value: string): string {
      let result = slugify(value)
      const originalSlug = result

      while (Object.hasOwn(occurrences, result)) {
        occurrences[originalSlug]++
        result = `${originalSlug}-${occurrences[originalSlug]}`
      }

      occurrences[result] = 0
      return result
    },
    reset() {
      for (const key of Object.keys(occurrences)) {
        delete occurrences[key]
      }
    },
  }
}
