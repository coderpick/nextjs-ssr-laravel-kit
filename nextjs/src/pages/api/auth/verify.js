import { verifyCsrfToken } from "@/lib/csrf";

export default function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { csrf_token, csrf_signature } = req.cookies;

    if (!csrf_token || !csrf_signature) {
        return res.status(419).json({ message: "CSRF token missing" });
    }
    if (!verifyCsrfToken(csrf_token, csrf_signature)) {
        return res.status(419).json({ message: "CSRF token invalid" });
    }
    
    res.status(200).json({ message: "CSRF token verified" });

}

