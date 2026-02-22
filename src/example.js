import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'
await initDatabase()

const post = new Post({
    title: 'Hello Mongoose!',
    author: 'JJ Abides',
    contents: 'This post is stored in MongoDB using Mongoose!',
    tags: ['mongodb', 'mongoose'],
})

await post.save()

const posts = await Post.find()
console.log(posts)
