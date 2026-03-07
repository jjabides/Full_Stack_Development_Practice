import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Blog } from './Blog.jsx'

const queryClient = new QueryClient()
const router = createBrowserRouter([
    {
        path: '/',
        element: <Blog />,
    },
])

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}
