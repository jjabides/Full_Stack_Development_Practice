// Convert Express request to a Fetch request

export function createFetchRequest(req) {
    const origin = `${req.protocol}://${req.get('host')}`
    const url = new URL(req.originalUrl || req.url, origin)

    const controller = new AbortController()
    req.on('close', () => controller.abort()) // Note: When does this happen?

    const headers = new Headers()
    for (const [key, values] of Object.entries(req.headers)) {
        if (!values) continue

        // Each header can have an array of values or a single value
        if (Array.isArray(values)) {
            for (const value of values) {
                headers.append(key, value)
            }
        } else {
            headers.set(key, values)
        }
    }

    // Create initial fetch request object
    const init = {
        method: req.method,
        headers,
        signal: controller.signal,
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        init.body = req.body
    }

    return new Request(url.href, init)
}
