import { createAxiosInstance } from '@/lib/axios';
import { withValidation } from "@/lib/withValidation";
import { VERIFY_HASH_ROUTE, getDynamicRoute } from '@/lib/route-service-provider';

export const handler = async (req, res) => {

    try {
        const { userId, hash, expires, signature } = req.query;

        const axios = createAxiosInstance(req, res);
        const response = await axios.get(getDynamicRoute(VERIFY_HASH_ROUTE, { userId, hash, expires, signature }));

        res.status(200).json(response.data);

    } catch (error) {

        if (error.response && error.response.data) {
            res.status(error.response.status).json({
                success: false,
                error: error.response.data.message,
                data: error.response.data,
            });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default withValidation({ verifyCsrfTokenCheck: true })(handler);

