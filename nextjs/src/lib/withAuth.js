import axios from 'axios';
import { createAxiosInstance } from './axios';
import { PROTECTED_ROUTES, GUEST_ROUTES, VERIFY_EMAIL_ROUTE, REDIRECT_IF_AUTHENTICATED, REDIRECT_IF_NOT_AUTHENTICATED, EMAIL_VERIFICATION_ROUTE } from './route-service-provider';

/**
 * This function is used to wrap a Next.js page component with authentication logic 
 * which includes several middleware checks just like laravel and to pass auth user object to the page component.
 * use it to protect your routes and redirect the user to the login page if they are not authenticated. 
 * 
 * @param {function} getServerSidePropsFunc - The function to get the server side props.
 * 
 * @returns {function} - The wrapped function.
 */

export function withAuth(getServerSidePropsFunc) {
    return async (context) => {

        const { req, res } = context;


        async function getUserData() {

            try {
                const axiosInstance = createAxiosInstance(req, res);
                const response = await axiosInstance.get('/api/user');
                return response.data;
            } catch (error) {

                if (axios.isAxiosError(error) && error.response?.status === 409 && error.response?.data?.message === 'Your email address is not verified.') 
                {
                    return {
                        redirect: {
                            emailVerified: false,
                            destination: EMAIL_VERIFICATION_ROUTE,
                        },
                    };
                }
                return null;
            }
        }


        const user = await getUserData();
        const pathname = context.resolvedUrl.split('?')[0];

        let isDynamicPath = false;
        let dynamicPathName = null;
        const queryKey = Object.keys(context.query)[0];
        if (queryKey && ['id', 'slug'].includes(queryKey)) {
            const value = context.query[queryKey];
            // check for UUID or numeric value
            if (/^[0-9a-fA-F-]{36}$/.test(value) || /^[0-9]+$/.test(value)) {
                isDynamicPath = true;
                dynamicPathName = pathname.replace(value, `[${queryKey}]`);
            }
        }
        
        const isProtectedRoute     = isDynamicPath ? PROTECTED_ROUTES.includes(dynamicPathName) : PROTECTED_ROUTES.includes(pathname);
        const isGuestRoute         = GUEST_ROUTES.includes(pathname);
        const isEmailVerifiedRoute = pathname.includes(VERIFY_EMAIL_ROUTE) || pathname.includes(EMAIL_VERIFICATION_ROUTE);

        if (user?.redirect?.emailVerified === false && !isEmailVerifiedRoute) {
            return {
                redirect: {
                    destination: EMAIL_VERIFICATION_ROUTE,
                    permanent: false,
                },
            };
        }

        if(user && context.resolvedUrl == EMAIL_VERIFICATION_ROUTE && user.email_verified_at)
        {
            return {
                redirect: {
                    destination: REDIRECT_IF_AUTHENTICATED,
                    permanent: false,
                }
            }
        }

        if (!user && isProtectedRoute) {
            // User is not authenticated and trying to access a protected route
            return {
                redirect: {
                    destination: REDIRECT_IF_NOT_AUTHENTICATED,
                    permanent: false,
                },
            };
        }


        if (user && isGuestRoute) {
            // User is authenticated and trying to access a guest route
            return {
                redirect: {
                    destination: REDIRECT_IF_AUTHENTICATED,
                    permanent: false,
                },
            };
        }


        // For non-protected and non-guest routes, or when authentication requirements are met
        if (getServerSidePropsFunc) {
            const pageProps = await getServerSidePropsFunc(context, user);
            if ('props' in pageProps) {
                return {
                    props: {
                        ...pageProps.props,
                        user: user || null,
                    },
                };
            }
            return pageProps;
        }


        // Default case: return the user data (or null if not authenticated)
        return { props: { user: user || null } };
    };
}
