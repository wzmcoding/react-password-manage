import { api } from "@/utils/request";

export function list() {
    return api.get("account").json()
}

export function add(data) {
    return api.post("account", {
        json: data,
    }).json();
}

export function update(data) {
    return api.put(`account`, {
        json: data,
    }).json();
}

export function del(id) {
    return api.delete(`account/${id}`).json();
}
