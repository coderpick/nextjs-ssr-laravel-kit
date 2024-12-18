import axios from "axios";
import { withValidation } from "@/lib/withValidation";
import { refresh_token_key, access_token_key } from "@/lib/utils";
import { LOGOUT_ROUTE } from '@/lib/route-service-provider';

const handler = async (req, res) => {

    if(req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    try {
        const response = await axios.post(`${process.env.NEXT_BACKEND_URL}${LOGOUT_ROUTE}`, {}, {
            headers: {
                'Authorization': `Bearer ${req.cookies[refresh_token_key]}`
            }
        });
        
        res.status(200).json({ message: 'Logged out' });

    } catch (error) {

        if(error.response && error.response.status === 401) {

            // if refresh token is expired, then we need to remove the access token and refresh token to logout the user
            res.setHeader('Set-Cookie', [
                `${access_token_key}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
                `${refresh_token_key}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
            ]);

            res.status(200).json({ message: 'Logged out' });
        }
        
        res.status(error.response.status).json({ message: error.response.data.message });
    }
}

export default withValidation({ verifyCsrfTokenCheck: true })(handler);

