<?php

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/db.php';

/**
 * Autoload classes from core/, models/, controllers/ and middleware/.
 */
spl_autoload_register(static function (string $class): void {
    foreach (['core', 'models', 'controllers', 'middleware'] as $directory) {
        $file = __DIR__ . "/{$directory}/{$class}.php";

        if (is_file($file)) {
            require_once $file;
            return;
        }
    }
});

/** Always answer with JSON, even when something throws. */
set_exception_handler(static function (Throwable $e): void {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');

    $payload = [
        'success' => false,
        'message' => APP_DEBUG ? $e->getMessage() : 'Something went wrong on the server.',
    ];

    if (APP_DEBUG) {
        $payload['file'] = $e->getFile();
        $payload['line'] = $e->getLine();
    }

    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
});

CorsMiddleware::handle();

$router = new Router();

// ---------------------------------------------------------------
//  Storefront
// ---------------------------------------------------------------
$router->get('/api/categories', 'CategoryController', 'index');
$router->get('/api/categories/{slug}', 'CategoryController', 'show');

$router->get('/api/products', 'ProductController', 'index');
$router->get('/api/products/{slug}', 'ProductController', 'show');
$router->post('/api/products/{slug}/reviews', 'ProductController', 'addReview');

$router->post('/api/orders', 'OrderController', 'store');
$router->post('/api/contacts', 'ContactController', 'store');
$router->post('/api/subscribers', 'SubscriberController', 'store');

// ---------------------------------------------------------------
//  Authentication
// ---------------------------------------------------------------
$router->post('/api/auth/login', 'AuthController', 'login');
$router->get('/api/auth/me', 'AuthController', 'me');

// ---------------------------------------------------------------
//  Admin (all handlers require a valid token)
// ---------------------------------------------------------------
$router->get('/api/admin/stats', 'StatsController', 'index');

$router->post('/api/products', 'ProductController', 'store');
$router->put('/api/products/{id}', 'ProductController', 'update');
$router->delete('/api/products/{id}', 'ProductController', 'destroy');

$router->post('/api/categories', 'CategoryController', 'store');
$router->put('/api/categories/{id}', 'CategoryController', 'update');
$router->delete('/api/categories/{id}', 'CategoryController', 'destroy');

$router->get('/api/orders', 'OrderController', 'index');
$router->get('/api/orders/{reference}', 'OrderController', 'show');
$router->put('/api/orders/{id}/status', 'OrderController', 'updateStatus');

$router->get('/api/contacts', 'ContactController', 'index');
$router->put('/api/contacts/{id}/read', 'ContactController', 'markRead');
$router->delete('/api/contacts/{id}', 'ContactController', 'destroy');

$router->get('/api/subscribers', 'SubscriberController', 'index');
$router->delete('/api/subscribers/{id}', 'SubscriberController', 'destroy');

// Image uploads for products and other content (multipart/form-data).
$router->post('/api/admin/uploads', 'UploadController', 'store');

$router->dispatch();
