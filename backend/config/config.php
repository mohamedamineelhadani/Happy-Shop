<?php
/**
 * Application configuration.
 */

// Absolute path to the backend directory.
define('BACKEND_PATH', dirname(__DIR__));

// Show detailed errors while developing; set to false in production.
define('APP_DEBUG', true);
define('APP_NAME', 'HappyShop');

// Comma separated list of allowed CORS origins, or '*' for any.
define('ALLOWED_ORIGINS', '*');

// Store settings.
define('CURRENCY', 'MAD');
define('SHIPPING_COST', 30);      // flat shipping fee
define('FREE_SHIPPING_FROM', 500); // subtotal from which shipping is free

// Secret used to sign admin auth tokens. Change this in production.
define('SECRET_KEY', 'change-me-happyshop-secret');

if (APP_DEBUG) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    error_reporting(0);
}

date_default_timezone_set('Africa/Casablanca');
