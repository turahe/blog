/**
 * @jest-environment node
 */
jest.mock('@/lib/auth/session', () => ({
  getSession: jest.fn(),
}))
jest.mock('@/lib/rbac', () => ({
  can: jest.fn(),
}))
jest.mock('@/modules/media/services/upload', () => ({
  processMediaUpload: jest.fn(),
  revertMediaUpload: jest.fn(),
}))

const { getSession } = require('@/lib/auth/session')
const { can } = require('@/lib/rbac')
const { processMediaUpload, revertMediaUpload } = require('@/modules/media/services/upload')
const { POST, DELETE } = require('@/app/api/media/upload/route')

function makeFile(name, type, content = 'x') {
  return new File([content], name, { type })
}

describe('POST /api/media/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns 401 when unauthenticated', async () => {
    getSession.mockResolvedValue(null)
    const form = new FormData()
    form.append('filepond', makeFile('a.pdf', 'application/pdf'))
    const req = new Request('http://localhost/api/media/upload', { method: 'POST', body: form })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  test('returns 400 for blocked executable', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(true)
    const form = new FormData()
    form.append('filepond', makeFile('virus.exe', 'application/x-msdownload'))
    const req = new Request('http://localhost/api/media/upload?purpose=media', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toMatch(/executable/i)
    expect(processMediaUpload).not.toHaveBeenCalled()
  })

  test('returns 403 when media purpose lacks media.upload', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(false)
    const form = new FormData()
    form.append('filepond', makeFile('a.pdf', 'application/pdf'))
    const req = new Request('http://localhost/api/media/upload?purpose=media', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  test('uploads media when permitted', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(true)
    processMediaUpload.mockResolvedValue({
      id: 'm1',
      url: 'http://cdn/x.pdf',
      filename: 'a.pdf',
      altText: null,
      width: null,
      height: null,
    })
    const form = new FormData()
    form.append('filepond', makeFile('a.pdf', 'application/pdf'))
    const req = new Request('http://localhost/api/media/upload?purpose=media', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.id).toBe('m1')
    expect(json.url).toBe('http://cdn/x.pdf')
  })

  test('avatar purpose does not require media.upload', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(false)
    processMediaUpload.mockResolvedValue({
      id: 'm2',
      url: 'http://cdn/a.jpg',
      filename: 'avatar.jpg',
      altText: null,
      width: 256,
      height: 256,
    })
    const form = new FormData()
    form.append('filepond', makeFile('avatar.jpg', 'image/jpeg'))
    const req = new Request('http://localhost/api/media/upload?purpose=avatar', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(can).not.toHaveBeenCalled()
  })
})

describe('DELETE /api/media/upload', () => {
  test('returns 401 when unauthenticated', async () => {
    getSession.mockResolvedValue(null)
    const req = new Request('http://localhost/api/media/upload', {
      method: 'DELETE',
      body: 'm1',
    })
    const res = await DELETE(req)
    expect(res.status).toBe(401)
  })

  test('reverts upload when permitted', async () => {
    getSession.mockResolvedValue({ user: { id: 'u1' } })
    can.mockResolvedValue(true)
    revertMediaUpload.mockResolvedValue(undefined)
    const req = new Request('http://localhost/api/media/upload', {
      method: 'DELETE',
      body: 'm1',
    })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    expect(revertMediaUpload).toHaveBeenCalledWith('m1', 'u1')
  })
})
