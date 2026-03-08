export const signup = async ({ username, password }) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('failed to sign up') // 'ok' is false if response contains a failed status code like 400
    return await res.json()
}

export const login = async ({ username, password }) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('failed to login')
    return await res.json()
}
