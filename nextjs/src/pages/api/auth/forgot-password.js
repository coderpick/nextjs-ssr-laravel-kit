import axios from "axios";
import { withValidation } from "@/lib/withValidation";
import { FORGOT_PASSWORD_ROUTE } from '@/lib/route-service-provider';

export const handler = async (req, res) => {

    try {
        const { email } = req.body;

        const response = await axios.post(`${process.env.NEXT_BACKEND_URL}${FORGOT_PASSWORD_ROUTE}`, { email });

        res.status(200).json(response.data);
    } catch (error) {

        if (error.response && error.response.data) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default withValidation({ verifyCsrfTokenCheck: true })(handler);



