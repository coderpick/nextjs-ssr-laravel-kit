import { verifyCsrfToken } from '@/lib/csrf';
import { defaultValue } from '@/lib/csrf';

/**
 * This function is used to wrap a Next.js API route with csrf protection logic.
 * 
 * @param {object} options - The options object.
 * @param {boolean} options.verifyCsrfTokenCheck - Whether to check for a CSRF token. default is false.
 * 
 * @returns {function} - The wrapped function.
 */
export const withValidation = (options = {}) => (handler) => async (req, res) => {
    const { apiKey = false, verifyCsrfTokenCheck = false } = options;

    // if (apiKey && !validateApiKey(req)) {
    //     return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    // }

    const csrfToken = defaultValue(req);
    if(!req.cookies.csrf_token || !req.cookies.csrf_signature || !csrfToken) {
        return res.status(419).json({ error: 'CSRF token missing' });
    }

    if (verifyCsrfTokenCheck && !verifyCsrfToken(req.cookies.csrf_token, req.cookies.csrf_signature, csrfToken)) {
        return res.status(419).json({ error: 'CSRF token invalid' });
    }

    return handler(req, res);
};
