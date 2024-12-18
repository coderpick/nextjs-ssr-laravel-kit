import axios from "axios";
import { withValidation } from "@/lib/withValidation";
import { RESET_PASSWORD_ROUTE } from '@/lib/route-service-provider';

const handler = async (req, res) => {

    try {
        const { token, email, password, password_confirmation } = req.body;

        const response = await axios.post(`${process.env.NEXT_BACKEND_URL}${RESET_PASSWORD_ROUTE}`, { token, email, password, password_confirmation });

        res.status(200).json(response.data);
    } catch (error) {

        if (error.response && error.response.data)  {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

}

export default withValidation({ verifyCsrfTokenCheck: true })(handler);

