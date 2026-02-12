import ky from "ky";

const baseURL = "http://localhost:8888";

export const api = ky.create({
    prefixUrl: baseURL,
    hooks: {
        beforeRequest: [
            (req) => {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    req.headers.set("Authorization", `Bearer ${token}`);
                    req.headers.set("Content-Type", "application/json");
                }
            },
        ],
    },
});
