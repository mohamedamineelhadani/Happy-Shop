<?php
require_once __DIR__."/config/config.php";
require_once __DIR__."/config/db.php";

require_once __DIR__."/core/Database.php";
require_once __DIR__."/core/Model.php";
require_once __DIR__."/core/Controller.php";
require_once __DIR__."/core/Router.php";

// require_once __DIR__."/middleware/CorsMiddleware.php";

require_once __DIR__."/models/Products.php";
require_once __DIR__."/models/Contact.php";

require_once __DIR__."/controllers/ContactController.php";
require_once __DIR__."/controllers/ProductsController.php";


// CorsMiddleware::handle();

$router = new Router();


$router->get('/api/products', 'ProductsController', 'getAll');
$router->get('/api/products/{id}', 'ProductsController', 'getById');


$router->get('/api/contact', 'ContactController', 'getAll');
$router->get('/api/contact/{id}', 'ContactController', 'getById');


$router->dispatch();


?>