import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import type { Root } from 'mdast'
import type { VFile } from 'vfile'
import type { TocHeading } from '@/types/post'

function remarkTocHeadings() {
  const slugger = new GithubSlugger()
  return (tree: Root, file: VFile) => {
    const toc: TocHeading[] = []
    visit(tree, 'heading', (node) => {
      const text = node.children.map((c) => ('value' in c ? c.value : '')).join('')
      toc.push({
        text,
        url: '#' + slugger.slug(text),
        level: node.depth,
      })
    })
    file.data.toc = toc
  }
}

export async function extractToc(rawMdx: string): Promise<TocHeading[]> {
  const vfile = await remark()
    .use(remarkTocHeadings as never)
    .process(rawMdx)
  return (vfile.data.toc as TocHeading[]) ?? []
}
