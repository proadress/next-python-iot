import { getCookie } from "cookies-next";
import { cookies } from "next/headers"

export default (token: string) => {
    cookies().set('token', token);
    const gettoken = cookies().get('token');
    console.log(gettoken);
}

export const getToken = () => {
        getCookie("token", { cookies });
        const token = cookies().get("token")?.value;
        return token;
}