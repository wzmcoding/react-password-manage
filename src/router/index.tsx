import { createBrowserRouter } from "react-router-dom"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Index from "@/pages/Index"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Index />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
])
