import axios from "axios";
import { withValidation } from "@/lib/withValidation";
import { access_token_key, refresh_token_key, access_token_expiration_key, refresh_token_expiration_key } from "@/lib/utils";
import { REGISTER_ROUTE } from '@/lib/route-service-provider';

const handler = async (req, res) => {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, password, password_confirmation } = req.body;

    try {
        
        const response = await axios.post(`${process.env.NEXT_BACKEND_URL}${REGISTER_ROUTE}`, { 
            name,
            email, 
            password,
            password_confirmation 
        });
    
        // create access and refresh tokens from the response with http only cookies
        const accessToken = response.data[access_token_key];
        const refreshToken = response.data[refresh_token_key];

        let cookiePrefix = process.env.ENVIRONMENT === 'local' ? '' : process.env.COOKIE_PREFIX;
        let secure = process.env.ENVIRONMENT === 'local' ? 'Secure' : '';
        let accessTokenExpiration = response.data[access_token_expiration_key];
        let refreshTokenExpiration = response.data[refresh_token_expiration_key];
        
        
        // Securing cookies using OWASP recommendations
        // https://owasp.org/www-chapter-london/assets/slides/OWASPLondon20171130_Cookie_Security_Myths_Misconceptions_David_Johansson.pdf
        
        res.setHeader('Set-Cookie', [
            `${cookiePrefix}${access_token_key}=${accessToken}; HttpOnly; ${secure}; SameSite=Lax; Path=/; Max-Age=${accessTokenExpiration}`, // 1 min
            `${cookiePrefix}${refresh_token_key}=${refreshToken}; HttpOnly; ${secure}; SameSite=Lax; Path=/; Max-Age=${refreshTokenExpiration}`, // 2 mins
        ]);
    
        res.status(response.status).json(response.data);
        
    } catch (error) {
        if (error?.response) {
            if (error?.response?.status === 422) {
                res.status(error?.response?.status).json(error?.response?.data);
            } else {
                res.status(error?.response?.status).json({
                    message: `An error occurred during register (${error?.response?.status})`,
                });
            }
        } else {
            // Handle errors without a response (e.g., network issues)
            res.status(500).json({
                message: 'An unexpected error occurred. Please try again later.',
                error: error?.message, // Optionally include error details for debugging
            });
        }

    }
};

export default withValidation({ verifyCsrfTokenCheck: true })(handler);

