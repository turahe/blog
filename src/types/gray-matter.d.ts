declare module 'gray-matter' {
  // Frontmatter shape varies per MDX file; keep `data` loose for seed/scripts.
  function matter(
    input: string | Buffer,
    options?: Record<string, unknown>
  ): {
    content: string
    data: Record<string, unknown>
    excerpt?: string
    isEmpty: boolean
    language: string
    matter: string
    orig: Buffer | string
    stringify: (language?: string) => string
  }

  export = matter
}
