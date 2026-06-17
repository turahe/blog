const { getPostFeaturedImage } = require('@/lib/blog/post-images')

describe('getPostFeaturedImage', () => {
  test('returns undefined when images is missing', () => {
    expect(getPostFeaturedImage()).toBeUndefined()
    expect(getPostFeaturedImage(null)).toBeUndefined()
  })

  test('returns trimmed string image', () => {
    expect(getPostFeaturedImage(' /static/images/cover.jpg ')).toBe('/static/images/cover.jpg')
    expect(getPostFeaturedImage('   ')).toBeUndefined()
  })

  test('returns first non-empty image from array', () => {
    expect(getPostFeaturedImage(['', '  ', '/static/images/a.jpg', '/static/images/b.jpg'])).toBe(
      '/static/images/a.jpg'
    )
  })
})
