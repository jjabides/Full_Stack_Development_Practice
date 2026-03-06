import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import {
    createPost,
    listAllPosts,
    listPostsByAuthor,
    listPostsByTag,
    getPostById,
    updatePost,
    deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

const sampleUser = {
    username: 'jjabides',
    password: 'password',
}

let createdSampleUser

beforeEach(async () => {
    await User.deleteMany() // Clear out database
    const createdUser = new User(sampleUser)
    createdSampleUser = await createdUser.save()
})

describe('creating posts', () => {
    test('with all parameters should succeed', async () => {
        console.info(createdSampleUser)
        const post = {
            title: 'Hello Mongoose!',
            author: createdSampleUser._id,
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
        expect(foundPost.author).toBeInstanceOf(mongoose.Types.ObjectId)
    })

    // Test creating a post without a title (required)
    test('without title should fail', async () => {
        const post = {
            author: createdSampleUser._id,
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
            author: createdSampleUser._id,
        }
        const createdPost = await createPost(post)
        expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
    })
})

const samplePosts = [
    { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
    { title: 'Learning React Hooks', author: 'Daniel Bugl', tags: ['react'] },
    { title: 'Full-Stack React Projects', author: 'Daniel Bugl', tags: ['react', 'nodejs', 'mongodb'] },
    { title: 'Guide to TypeScript' },
]

let createdSamplePosts = []

beforeEach(async () => {
    await Post.deleteMany() // Clear out database
    createdSamplePosts = []
    for (const post of samplePosts) {
        post.author = createdSampleUser._id
        const createdPost = new Post(post)
        // Add sample data to database and retreive posts with attached metadata
        createdSamplePosts.push(await createdPost.save())
    }
})

describe('listing posts', () => {
    test('should return all posts', async () => {
        const posts = await listAllPosts()
        expect(posts.length).toEqual(createdSamplePosts.length)
    })

    test('should return posts sorted by creation date descending by default', async () => {
        const posts = await listAllPosts()
        const sortedSamplePosts = createdSamplePosts.sort((a, b) => b.createdAt - a.createdAt)
        expect(posts.map((post) => post.createdAt)).toEqual(sortedSamplePosts.map((post) => post.createdAt))
    })

    test('should take into account provided sorting options', async () => {
        const posts = await listAllPosts({
            sortBy: 'updatedAt',
            sortOrder: 'ascending',
        })
        const sortedSamplePosts = createdSamplePosts.sort((a, b) => a.updatedAt - b.updatedAt)
        expect(posts.map((post) => post.updatedAt)).toEqual(sortedSamplePosts.map((post) => post.updatedAt))
    })

    test('should be able to filter posts by author', async () => {
        const posts = await listPostsByAuthor(createdSampleUser._id)
        expect(posts.length).toBe(3)
    })

    test('should be able to filter posts by tag', async () => {
        const posts = await listPostsByTag('nodejs')
        expect(posts.length).toBe(1)
    })
})

describe('getting a post', () => {
    test('should return the full post', async () => {
        const post = await getPostById(createdSamplePosts[0]._id)
        expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
    })

    test('should fail if the id does not exist', async () => {
        const post = await getPostById('000000000000000000000000')
        expect(post).toEqual(null)
    })
})

describe('updating posts', () => {
    test('should update the specified property', async () => {
        await updatePost(createdSamplePosts[0]._id, {
            author: 'Test Author',
        })
        const updatedPost = await Post.findById(createdSamplePosts[0]._id) // Why not use getPostById()?
        expect(updatedPost.author).toEqual('Test Author')
    })

    test('should not update other properties', async () => {
        await updatePost(createdSamplePosts[0]._id, {
            author: 'Test Author',
        })
        const updatedPost = await Post.findById(createdSamplePosts[0]._id)
        expect(updatedPost.title).toEqual('Learning Redux')
        expect(updatedPost.tags).toEqual(createdSamplePosts[0].tags)
    })

    test('should update the updatedAt timestamp', async () => {
        await updatePost(createdSamplePosts[0]._id, {
            author: 'Test Author',
        })
        const updatedPost = await Post.findById(createdSamplePosts[0]._id)
        expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(createdSamplePosts[0].updatedAt.getTime())
    })

    test('should fail if the id does not exist', async () => {
        const post = await updatePost('000000000000000000000000', {
            author: 'Test Author',
        })
        expect(post).toEqual(null)
    })
})

describe('deleting posts', () => {
    test('should remove the post from the database', async () => {
        const result = await deletePost(createdSamplePosts[0]._id)
        expect(result.deletedCount).toEqual(1)
        const deletedPost = await Post.findById(createdSamplePosts[0]._id)
        expect(deletedPost).toEqual(null)
    })

    test('should fail if the id does not exist', async () => {
        const result = await deletePost('000000000000000000000000')
        expect(result.deletedCount).toEqual(0)
    })
})
