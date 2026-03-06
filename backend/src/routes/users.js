import { createUser, loginUser } from '../services/users.js'

export function userRoutes(app) {
    app.post('/api/v1/user/signup', async (req, res) => {
        try {
            const user = await createUser(req.body)
            return res.status(201).json({ username: user.username })
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    })

    app.post('/api/v1/user/login', async (req, res) => {
        try {
            const token = await loginUser(req.body)
            return res.status(200).send({ token }) // Note: Why use send() here? We should be using json(), no?
        } catch (err) {
            return res.status(400).send('login failed, incorrect username or password')
        }
    })
}
