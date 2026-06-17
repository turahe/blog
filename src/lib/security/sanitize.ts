const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => HTML_ESCAPE[c] ?? c)
}

export function sanitizeString(input: string, maxLength = 1000): string {
  return escapeHtml(input.trim().slice(0, maxLength))
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 255)
}
