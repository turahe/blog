import assert from 'node:assert/strict'
import { after, before, it } from 'node:test'
import { commentRepository } from '@/modules/comments/repositories'
import { listApprovedCommentsForPost } from '@/modules/comments/services'
import { describeIntegration } from './helpers/describe-integration'
import { cleanupComments, getSeededPost } from './helpers/db'

describeIntegration('comments integration', () => {
  const createdIds: string[] = []
  let postId = ''
  let postSlug = ''

  before(async () => {
    const post = await getSeededPost()
    postId = post.id
    postSlug = post.slug
  })

  after(async () => {
    await cleanupComments(createdIds)
  })

  it('creates an approved comment and lists it for the post', async () => {
    const unique = `integration-${Date.now()}`
    const comment = await commentRepository.create({
      content: `Integration test comment ${unique}`,
      status: 'APPROVED',
      authorName: 'Integration Tester',
      authorEmail: 'integration@example.com',
      post: { connect: { id: postId } },
    })
    createdIds.push(comment.id)

    const listed = await listApprovedCommentsForPost(postSlug)
    const match = listed.find((item) => item.id === comment.id)

    assert.ok(match)
    assert.match(match?.content ?? '', new RegExp(unique))
    assert.equal(match?.author.name, 'Integration Tester')
  })

  it('creates a reply nested under a parent comment', async () => {
    const parent = await commentRepository.create({
      content: `Parent comment ${Date.now()}`,
      status: 'APPROVED',
      authorName: 'Parent Author',
      authorEmail: 'parent@example.com',
      post: { connect: { id: postId } },
    })
    createdIds.push(parent.id)

    const reply = await commentRepository.create({
      content: 'Nested reply from integration test',
      status: 'APPROVED',
      authorName: 'Reply Author',
      authorEmail: 'reply@example.com',
      post: { connect: { id: postId } },
      parent: { connect: { id: parent.id } },
    })
    createdIds.push(reply.id)

    const listed = await listApprovedCommentsForPost(postSlug)
    const parentItem = listed.find((item) => item.id === parent.id)
    const nested = parentItem?.replies.find((item) => item.id === reply.id)

    assert.ok(nested)
    assert.equal(nested?.content, 'Nested reply from integration test')
  })

  it('excludes pending comments from the public list', async () => {
    const pending = await commentRepository.create({
      content: `Pending moderation ${Date.now()}`,
      status: 'PENDING',
      authorName: 'Pending Author',
      authorEmail: 'pending@example.com',
      post: { connect: { id: postId } },
    })
    createdIds.push(pending.id)

    const listed = await listApprovedCommentsForPost(postSlug)
    assert.equal(
      listed.some((item) => item.id === pending.id),
      false
    )
  })
})
