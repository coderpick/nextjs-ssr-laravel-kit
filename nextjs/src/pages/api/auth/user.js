import axios from "axios";
import { createAxiosInstance } from "@/lib/axios";
import { USER_ROUTE } from '@/lib/route-service-provider';

export default async function handler(req, res) {
    try {
        const axios = createAxiosInstance(req, res);
        const response = await axios.get(USER_ROUTE);

        res.status(200).json(response.data);
    } catch (error) {
        
        if (error.response && error.response.data) {

            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
