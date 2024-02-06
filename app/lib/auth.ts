import { redirect } from 'next/navigation'
import { getToken } from './cookie';
import { API_URL } from '@/config';

const auth = async () => {

    try {
        const token = getToken();
        if (!token) {
            return redirect('/login') // Navigate to the new post page
        }
        const res = await fetch(`${API_URL}/api/auth/user`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
        if (!res.ok) {
            return redirect('/login') // Navigate to the new post page
        } return await res.json();

    } catch (err) {
        console.log(err);
        return redirect('/login') // Navigate to the new post page
    }
}
export default auth;