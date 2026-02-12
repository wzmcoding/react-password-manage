import { api } from "@/utils/request";

export function login(data) {
    return api.post("user/login", {
        json: data,
    }).json()
}

export function register(data) {
    return api.post("user/register", {
        json: data,
    }).json();
}
