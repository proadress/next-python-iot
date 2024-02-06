import { getCookie } from "cookies-next";
import { cookies } from "next/headers"

export const getToken = () => {
    getCookie("token", { cookies });
    const token = cookies().get("token")?.value;
    return token;
}