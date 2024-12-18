import { createAxiosInstance } from '@/lib/axios';
import { withValidation } from "@/lib/withValidation";
import { EMAIL_VERIFICATION_NOTIFICATION_ROUTE } from '@/lib/route-service-provider';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const axios = createAxiosInstance(req, res);

  try {
    const response = await axios.post(EMAIL_VERIFICATION_NOTIFICATION_ROUTE);

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response && error.response.data) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default withValidation({ verifyCsrfTokenCheck: true })(handler);

