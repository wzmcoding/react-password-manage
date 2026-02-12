import { api } from "@/utils/request";
import { fetchWithCache } from "@/utils/cache";

export function login(data) {
    return fetchWithCache("user-login", () =>
        api.post("user/login", {
            json: data,
        }).json()
    );
}

export function register(data) {
    return api.post("user/register", {
        json: data,
    }).json();
}
