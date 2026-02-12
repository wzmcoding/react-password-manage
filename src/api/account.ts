import { api } from "@/utils/request";
import { fetchWithCache } from "@/utils/cache";

export function getAccountList() {
    return fetchWithCache("account-list", () =>
        api.get("account").json()
    );
}
