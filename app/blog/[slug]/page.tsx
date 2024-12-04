import PostSimple from '@/layouts/PostSimple'

export default async function Page({ params }) {
    const response = await fetch(`http://site.test/api/v1/blogs/${params.slug}`)
    const data = await response.json()
    const post = data.data

    const next = {
        path: '',
        title: '',
    }
    const prev = {
        path: '',
        title: '',
    }
    return (
        <PostSimple post={post} next={next} prev={prev}>
            {post.content}
        </PostSimple>
    )
}