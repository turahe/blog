export function getPostFeaturedImage(images?: string | string[]): string | undefined {
  if (!images) return undefined
  if (typeof images === 'string') {
    const trimmed = images.trim()
    return trimmed || undefined
  }
  const first = images.find((img) => img?.trim())
  return first?.trim()
}
