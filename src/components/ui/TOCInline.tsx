import type { TocHeading } from '@/types/post'

interface TocItem extends TocHeading {
  children?: TocItem[]
}

function createNestedList(items: TocHeading[]): TocItem[] {
  const nestedList: TocItem[] = []
  const stack: TocItem[] = []

  items.forEach((item) => {
    const newItem: TocItem = { ...item }
    while (stack.length > 0 && stack[stack.length - 1].level >= newItem.level) {
      stack.pop()
    }
    const parent = stack.length > 0 ? stack[stack.length - 1] : null
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newItem)
    } else {
      nestedList.push(newItem)
    }
    stack.push(newItem)
  })

  return nestedList
}

export default function TOCInline({
  toc,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
  collapse = false,
  ulClassName = '',
  liClassName = '',
}: {
  toc: TocHeading[]
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
  collapse?: boolean
  ulClassName?: string
  liClassName?: string
}) {
  const re = Array.isArray(exclude)
    ? new RegExp(`^(${exclude.join('|')})$`, 'i')
    : new RegExp(`^(${exclude})$`, 'i')

  const filteredToc = toc.filter(
    (heading) =>
      heading.level >= fromHeading && heading.level <= toHeading && !re.test(heading.text)
  )

  const createList = (items?: TocItem[]) => {
    if (!items?.length) return null
    return (
      <ul className={ulClassName}>
        {items.map((item, index) => (
          <li key={index} className={liClassName}>
            <a href={item.url}>{item.text}</a>
            {createList(item.children)}
          </li>
        ))}
      </ul>
    )
  }

  const nestedList = createNestedList(filteredToc)

  if (asDisclosure) {
    return (
      <details open={!collapse}>
        <summary className="ml-6 pt-2 pb-2 text-xl font-bold">Table of Contents</summary>
        <div className="ml-6">{createList(nestedList)}</div>
      </details>
    )
  }

  return createList(nestedList)
}
