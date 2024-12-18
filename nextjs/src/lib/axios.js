import axios from 'axios';
import { toast } from 'react-toastify';
import { access_token_key, refresh_token_key, access_token_expiration_key, refresh_token_expiration_key } from "@/lib/utils";

// frontend axios instance
export const front = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

front.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 ) {
            toast.error(error.response?.data?.message);
        }
        
        if(error.response?.status === 419) {
            toast.error("PAGE EXPIRED"); 
        }
        if (error.response?.status === 429) {
            toast.error(error.response?.data?.message);
        }
        if (error.response?.status === 500) {
            toast.error("Oops some error occured");
        }
        return Promise.reject(error);
    }
);



// nextjs backend axios instance
export const api = axios.create({
    baseURL: process.env.NEXT_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

let isRefreshing = false;

export const createAxiosInstance = (req, res) => {
    const access_token = req.cookies[access_token_key];

    const axiosInstance = axios.create({
        baseURL: process.env.NEXT_BACKEND_URL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        withCredentials: true,
    });

    axiosInstance.interceptors.request.use(async (config) => {
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    });

    axiosInstance.interceptors.response.use(
        async (response) => response,
        async (error) => {
            const originalRequest = error.config;
            
            
            if (error.response?.status === 401 && !originalRequest._retry) {

                if (isRefreshing) {
                    return Promise.reject({
                        response: {
                            status: 401,
                            data: {
                                message: 'Unauthorized please log in again',
                            },
                        },
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const old_refresh_token = req.cookies[refresh_token_key];
                    const response = await axiosInstance.post('/api/refresh-token', {}, {
                        headers: {
                            Authorization: `Bearer ${old_refresh_token}`,
                        },
                    });

                    const accessToken = response.data[access_token_key];
                    const refreshToken = response.data[refresh_token_key];
                    const accessTokenExpiration = response.data[access_token_expiration_key];
                    const refreshTokenExpiration = response.data[refresh_token_expiration_key];

                    res.setHeader('Set-Cookie', [
                        `${access_token_key}=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${accessTokenExpiration}`,
                        `${refresh_token_key}=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${refreshTokenExpiration}`,
                    ]);

                    isRefreshing = false;

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    
                    isRefreshing = false;

                    res.setHeader('Set-Cookie', [
                        `${access_token_key}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
                        `${refresh_token_key}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
                    ]);

                    return Promise.reject(err);
                }
            }
            
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default api; 