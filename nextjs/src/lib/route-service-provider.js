/**
 * Route Service Provider
 * 
 * This file contains the routes for the application.
 * It also contains a helper function to generate dynamic routes.
 */

/**
 * Protected Routes
 * 
 * These are the routes that require authentication.
 */
export const PROTECTED_ROUTES = ['/dashboard', '/profile', '/verify-email'];


/**
 * Guest Routes
 * 
 * These are the routes that do not require authentication.
 */
export const GUEST_ROUTES = ['/login', '/register', '/forgot-password'];


/**
 * Redirect If Authenticated
 * 
 * This is the route that the user will be redirected to if they are authenticated.
 */
export const REDIRECT_IF_AUTHENTICATED = '/dashboard';


/**
 * Redirect If Not Authenticated
 * 
 * This is the route that the user will be redirected to if they are not authenticated.
 */
export const REDIRECT_IF_NOT_AUTHENTICATED = '/login';


/**
 * Email Verification Route
 * 
 * This is the route that the user will be redirected to if they need to verify their email.
 */
export const EMAIL_VERIFICATION_ROUTE = '/verify-email';
export const VERIFY_EMAIL_ROUTE = '/email/verify';


/**
 * Laravel Authentication Routes
 */
export const REFRESH_TOKEN_ROUTE                    = '/refresh-token';
export const EMAIL_VERIFICATION_NOTIFICATION_ROUTE  = '/api/email/verification-notification';
export const FORGOT_PASSWORD_ROUTE                  = '/api/forgot-password';
export const RESET_PASSWORD_ROUTE                   = '/api/reset-password';
export const REGISTER_ROUTE                         = '/api/register';
export const LOGIN_ROUTE                            = '/api/login';
export const LOGOUT_ROUTE                           = '/api/logout';
export const USER_ROUTE                             = '/api/user';
export const VERIFY_HASH_ROUTE                      = '/api/email/verify/[userId]/[hash]?expires=[expires]&signature=[signature]';


/**
 * Generates a dynamic route by replacing placeholders with actual values.
 *
 * @param {string} route - The route template with placeholders.
 * @param {Object} params - An object containing values to replace placeholders.
 * @returns {string} - The dynamically generated route.
 */

export const getDynamicRoute = (route, params) => {
    return Object.keys(params).reduce((resultRoute, key) => {
        return resultRoute.replace(`[${key}]`, params[key]);
    }, route);
}
