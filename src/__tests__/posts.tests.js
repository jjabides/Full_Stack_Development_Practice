import mongoose from 'mongoose'
import { describe, expect, test } from '@jest/globals'
import { createPost } from '../services/posts.js'
import { Post } from '../db/models/post.js'

describe('creating posts', () => {
    test('with all parameters should succeed', async () => {
        const post = {
            title: 'Hello Mongoose!',
            author: 'Daniel Bugl',
            contents: 'This post is stored in a mongoDB database using Mongoose.',
            tags: ['mongoose', 'mongodb'],
        }

        // Testing createPost
        const createdPost = await createPost(post)
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId) // verify that _id is an instance of ObjectId

        // Retreive post
        const foundPost = await Post.findById(createdPost._id)

        // Test that the retreived post is the same as the original post
        expect(foundPost).toEqual(expect.objectContaining(post))
        expect(foundPost.createdAt).toBeInstanceOf(Date)
        expect(foundPost.updatedAt).toBeInstanceOf(Date)
    })

    // Test creating a post without a title (required)
    test('without title should fail', async () => {
        const post = {
            author: 'Daniel Bugl',
            contents: 'Post with no title',
            tags: ['empty'],
        }

        try {
            await createPost(post)
        } catch (err) {
            expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
            expect(err.message).toContain('`title` is required')
        }
    })

    test('with minimal parameters should succeed', async () => {
        const post = {
            title: 'Only a title',
        }
        const createdPost = await createPost(post)
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    })
})
