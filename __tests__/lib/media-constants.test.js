const {
  getExtension,
  formatFileSize,
  slugifyFolderName,
  isImageMime,
} = require('@/modules/media/constants')

describe('media constants helpers', () => {
  test('getExtension returns lowercase extension', () => {
    expect(getExtension('photo.JPG')).toBe('jpg')
    expect(getExtension('noextension')).toBe('')
  })

  test('formatFileSize formats bytes', () => {
    expect(formatFileSize(512)).toBe('512 B')
    expect(formatFileSize(2048)).toBe('2.0 KB')
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
  })

  test('slugifyFolderName creates URL-safe slug', () => {
    expect(slugifyFolderName('  My Folder!  ')).toBe('my-folder')
  })

  test('isImageMime detects image mime types', () => {
    expect(isImageMime('image/png')).toBe(true)
    expect(isImageMime('video/mp4')).toBe(false)
  })
})
