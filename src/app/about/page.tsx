import AuthorLayout from '@/layouts/AuthorLayout'
import { MdxContent } from '@/components/MdxContent'
import { getAuthorBySlug, getExperience } from '@/services'
import { genPageMetadata } from '@/app/seo'
import { notFound } from 'next/navigation'

export const metadata = genPageMetadata({ title: 'About' })
export const revalidate = 3600

export default async function Page() {
  const [author, experience] = await Promise.all([getAuthorBySlug('default'), getExperience()])

  if (!author) return notFound()

  return (
    <AuthorLayout content={author} experience={experience}>
      <MdxContent source={author.body} />
    </AuthorLayout>
  )
}
