import { api } from "@/utils/request";

export function list() {
    return api.get("account").json()
}

export function add(data) {
    return api.post("account", {
        json: data,
    }).json();
}
