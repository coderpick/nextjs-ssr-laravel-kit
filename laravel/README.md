# Laravel 10

## Introduction

This is a laravel 10 backend for a nextjs frontend which includes authentication, authorization, csrf protection, and more.
This includes Token based authentication using Access Token and Refresh Token Logic.

#### Important Note:
> Note: After this Setup you need to setup the Nextjs frontend and set the NEXT_BACKEND_URL (optional if you want to use the default url) in the .env.local file.


## Prerequisites

- Laravel Sanctum (Token Based Authentication)

### Installation

First clone this laravel backend and install its dependencies.

```
git clone https://github.com/CODE-AXION/laravel-next-ssr.git
```

```
composer install
```

```
php artisan migrate
```

```
php artisan db:seed
```

```
php artisan serve --host=localhost --port=8000
```

### Additional Information:
- Reset password url is set in the AuthServiceProvider.php file

```php
ResetPassword::createUrlUsing(function ($user, string $token) {
    return config('app.frontend_url') . '/reset-password/' . $token . '?email=' . $user->email;
});
```


- Email verification url and mail is set in the Notifications/VerifyEmail.php file