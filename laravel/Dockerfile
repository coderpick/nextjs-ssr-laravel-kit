# Use an official PHP image with Apache as the base image.
FROM php:8.2-apache

ARG UID
ARG GID

ENV UID=${UID}
ENV GID=${GID}


# Create a group with the specified GID
RUN groupadd -g ${GID} laravel

# Create a user with the specified UID and add it to the laravel group
RUN useradd -g laravel -u ${UID} -s /bin/sh -m laravel



# Set environment variables.
ENV ACCEPT_EULA=Y
LABEL maintainer="codeaxion77@gmail.com"


# Install system dependencies.
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules required for Laravel.
RUN a2enmod rewrite

# Set the Apache document root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Update the default Apache site configuration
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Install PHP extensions.
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql mysqli && docker-php-ext-enable pdo_mysql mysqli 


# Install Composer globally.
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


# Create a directory for your Laravel application.
WORKDIR /var/www/html

# Copy the Laravel application files into the container.
COPY . .

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions for Laravel.
RUN chown -R laravel:laravel storage bootstrap/cache

USER laravel


# Expose port 80 for Apache.
EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
