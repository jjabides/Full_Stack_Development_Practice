import ReactDOMServer from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import { App } from './App.jsx'
import { routes } from './routes.jsx'
import { createFetchRequest } from './request.js'

const handler = createStaticHandler(routes)

export async function render(req) {
    const fetchRequest = createFetchRequest(req) // convert Express request to Fetch request
    const context = await handler.query(fetchRequest) // create context based on request
    const router = createStaticRouter(handler.dataRoutes, context)
    return ReactDOMServer.renderToString(
        <App>
            <StaticRouterProvider router={router} context={context} />
        </App>,
    )
}
