const {
  isBlockedExecutable,
} = require('@/modules/media/executable-policy')

describe('isBlockedExecutable', () => {
  test('allows common documents and media', () => {
    expect(isBlockedExecutable('doc.pdf', 'application/pdf')).toBe(false)
    expect(isBlockedExecutable('archive.zip', 'application/zip')).toBe(false)
    expect(isBlockedExecutable('song.mp3', 'audio/mpeg')).toBe(false)
    expect(isBlockedExecutable('notes.txt', 'text/plain')).toBe(false)
  })

  test('blocks executable extensions regardless of mime', () => {
    expect(isBlockedExecutable('setup.exe', 'application/octet-stream')).toBe(true)
    expect(isBlockedExecutable('tool.DLL', 'application/octet-stream')).toBe(true)
    expect(isBlockedExecutable('run.sh', '')).toBe(true)
  })

  test('blocks executable mime types even with safe-looking names', () => {
    expect(isBlockedExecutable('payload.bin', 'application/x-msdownload')).toBe(true)
    expect(
      isBlockedExecutable('payload.bin', 'application/vnd.microsoft.portable-executable')
    ).toBe(true)
  })

  test('allows octet-stream when extension is not blocked', () => {
    expect(isBlockedExecutable('data.bin', 'application/octet-stream')).toBe(false)
    expect(isBlockedExecutable('report.pdf', 'application/octet-stream')).toBe(false)
  })
})
