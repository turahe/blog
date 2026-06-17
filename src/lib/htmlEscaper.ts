const esca: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}

const pattern = /[&<>'"]/g

export function escape(text: string): string {
  return text.replace(pattern, (char) => esca[char])
}
