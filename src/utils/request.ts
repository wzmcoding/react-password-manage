import ky from "ky"

const baseURL = "http://localhost:8888"

export const api = ky.create({
    prefixUrl: baseURL,
    hooks: {
        beforeRequest: [
            (request) => {
                const token = localStorage.getItem("accessToken")
                if (token) {
                    request.headers.set("Authorization", `Bearer ${token}`)
                }
                request.headers.set("Content-Type", "application/json")
            },
        ],

        afterResponse: [
            async (request, options, response) => {
                // token 失效
                if (response.status === 401) {
                    localStorage.removeItem("accessToken")
                    window.location.href = "/login"
                }

                return response
            },
        ],
    },
})
