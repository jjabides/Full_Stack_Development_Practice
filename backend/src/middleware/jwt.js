import { expressjwt } from 'express-jwt'

export const requireAuth = expressjwt({
    secret: () => process.env.JWT_SECRET, // load JWT secret dynamically since dontenv isn't initialized yet.
    algorithms: ['HS256'],
})
