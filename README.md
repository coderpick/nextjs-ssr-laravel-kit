# Laravel Breeze - Next.js (SSR-Server Side Authentication) Edition ▲

## Introduction

This is a SSR Next.js frontend for Laravel backend apis which includes authentication, authorization, csrf protection, and more.
It uses similar structure of the laravel breeze. 
I tried to make it with next-auth library but I found its implementation overly complex, especially for managing refresh tokens, cookie expiration, and other configurations, So Instead I created this starter kit to keep things simple and straightforward.

### Core features:
- Stateless Authentication
- SSR Authentication
- Middleware checks for protected routes, guest routes, verify email just like laravel.
- Signed Double Submit CSRF Protection
- HttpOnly Cookie secure tokens
- Security guidelines (COOKIES, CSRF) following OWASP Guidelines
- Refresh Token for preventing token expiration
- Reusable authorization helpers

## Prerequisites
- Laravel Sanctum (Token Based Authentication)
- Next.js Pages Router With API Routes Handler

> Note: Do not install laravel breeze api package instead use this one mentioned in the repo because it uses token based authentication instead of sessions .

## Installation Laravel Setup

#### First clone this Laravel Backend and install its dependencies.

```
git clone https://github.com/CODE-AXION/nextjs-ssr-laravel-kit
```

```
cd /laravel-breeze-next-ssr/laravel
```

```
composer install
```

```
php artisan key:generate
```

```
php artisan migrate
```

```
php artisan db:seed
```



### Important:
- Next, ensure that you have to add the Laravel `API_URL` and `FRONTEND_URL` environment variables in the `.env` file or you might face some issues. 
```
API_URL=http://localhost:8000/api
FRONTEND_URL=http://localhost:3000
```

- After defining the appropriate environment variables, you may serve the Laravel application using the below Artisan command:

```
php artisan serve --host=localhost --port=8000
```


### Additional Information:
- Email verification url and mail is set in the Notifications/VerifyEmail.php file
- Reset password url is set in the AuthServiceProvider.php file

```php
ResetPassword::createUrlUsing(function ($user, string $token) {
    return config('app.frontend_url') . '/reset-password/' . $token . '?email=' . $user->email;
});
```

- Default expiration time for tokens are set in the `config/sanctum.php` file 
- If you want you can change it (ALWAYS GIVE EXPIRATION TIME IN SECONDS or it may lead to unexpected behaviour).
- Default Expiration time for Access token is `1 day` and for Refresh token is `7 days`.


## Frontend Setup

- Next, `cd nextjs` and install its dependencies with `yarn install` or `npm install`. Then, copy the `.env.example` file to `.env.local` and supply the URL of your backend:

```
NEXT_BACKEND_URL=http://localhost:8000
```

Important Note: 

Generate any random key for `CSRF_SECRET_KEY` and add that value in the `.env.local` file.

IF YOU DONT SPECIFY THIS KEY YOUR APPLICATION WILL CRASH.

```
CSRF_SECRET_KEY=any_random_key
```

Finally, run the application via `npm run dev`. The application will be available at `http://localhost:3000`:

```
npm run dev
```

> Note: Currently, we recommend using `localhost` during local development of your backend and frontend to avoid CORS "Same-Origin" issues.

## How This Starter Kit Works
### Calling APIs via Backend Proxy (Nextjs Backend)

#### We are treating Nextjs backend as a Proxy which will call our laravel Backend Apis.

### Data Fetching (Axios)
- we are fetching data from laravel backend apis via Nextjs backend.
- we have refresh token logic to refresh access token when it's expired in axios using axios interceptors. 
- use createAxiosInstance function to create axios instance to access backend apis which requires authentication so whenever the access token is expired, it will be refreshed automatically.
- use normal axios instance to call backend apis which doesn't require authentication.


### Access backend apis which requires authentication, you can use the following example:
```js
// the access token will be automatically passed no need to pass it manually

// pages/api/invoices.js <--- Nextjs backend api
const axios = createAxiosInstance(req, res);
const response = await axios.get('/api/invoices'); <--- laravel backend api
```

### Access backend apis which doesn't require authentication, you can use the following example:

```js
// pages/api/users.js <--- Nextjs backend api
const response = await axios.get(`${process.env.NEXT_BACKEND_URL}/api/products`); <--- laravel backend api
```

### withAuth.js
- this is a getServerSideProps wrapper that will be used to access the currently authenticated user via SSR.
- this includes several middlewares checks just like laravel like protected routes, guest routes, verify email, etc. if you want to add more middlewares checks, you can add it in the withAuth.js file.

```js
        const user = await getUserData();

        const isProtectedRoute     = PROTECTED_ROUTES.includes(context.resolvedUrl);
        const isGuestRoute         = GUEST_ROUTES.includes(context.resolvedUrl);
        const isEmailVerifiedRoute = context.resolvedUrl.includes(VERIFY_EMAIL_ROUTE) || context.resolvedUrl.includes(EMAIL_VERIFICATION_ROUTE);

        if (!user && isProtectedRoute) {
            // User is not authenticated and trying to access a protected route
            return {
                redirect: {
                    destination: REDIRECT_IF_NOT_AUTHENTICATED,
                    permanent: false,
                },
            };
        }


        // add more middlewares checks here
```

### How to use withAuth.js

```js
import { withAuth } from '@/lib/withAuth';

export const getServerSideProps = withAuth(async (context, user) => {
    const { req } = context;

    // if (!hasPermission(user, 'create post')) {

    //     // return redirect back to 403 page
    //     return {
    //         redirect: {
    //             destination: '/403',
    //             permanent: false,
    //         },
    //     };
    // }

    return {
        props: { user }, // Pass the user data to the page component
    };
});
```


### withValidation.js
- this is a CSRF Protection wrapper for our Nextjs backend apis .
- this will be used to validate the CSRF token in our Nextjs backend apis.

### How to use withValidation.js

```js
import { withValidation } from "@/lib/withValidation";

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

    // your logic here

}

// verifyCsrfTokenCheck: true will be used to validate the CSRF token in our nextjs backend apis.
export default withValidation({ verifyCsrfTokenCheck: true })(handler);
```

### Utils
- this is a utils file that will be used to access the access and refresh tokens.
- this includes several keys names for the access and refresh tokens.
- so if you change them in the response in laravel apis, you also have to change them here.

### Route service provider
- this is a service provider file that will be used to register the protected and guest routes middlewares.
- it includes keys for middleware checks mentioned below.

- `PROTECTED_ROUTES`: this is an array of protected routes that will be used to register the protected routes middlewares.
- `GUEST_ROUTES`: this is an array of guest routes that will be used to register the guest routes middlewares.
- `REDIRECT_IF_AUTHENTICATED`: this is a key for the route that will be used to redirect the user to the login page if they are authenticated.
- `REDIRECT_IF_NOT_AUTHENTICATED`: this is a key for the route that will be used to redirect the user to the login page if they are not authenticated.
- `EMAIL_VERIFICATION_ROUTE`: this is a key for the route that will be used to redirect the user to the email verification page.
- `VERIFY_EMAIL_ROUTE`: this is a key for the route that will be used to verify the email.
- `Laravel Authentication Routes`: this is an array of authentication routes.

```js
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
 * Authentication Routes
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

```

## Contributing

Let me know any issues you found or if you want to add any enhancements or features .
This repo is open for contributions.