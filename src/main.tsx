import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom"
import { router } from "@/router"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
    <div>
        <RouterProvider router={router} />
        <Toaster />
    </div>
)
