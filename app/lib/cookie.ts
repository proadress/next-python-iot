import { getCookie } from "cookies-next";
import { cookies } from "next/headers"

export const serverGetToken = () => {
    getCookie("token", { cookies });
    const token = cookies().get("token")?.value;
    return token;
}