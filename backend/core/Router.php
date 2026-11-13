<?php
class Router {
    private $routes = [];

    public function get($path, $controller, $method) {
        $this->addRoute('GET', $path, $controller, $method);
    }

    private function addRoute($method, $path, $controller, $action) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'controller' => $controller,
            'action' => $action
        ];
    }



    public function dispatch() {
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $basePath = dirname($_SERVER['SCRIPT_NAME']);
        
        if ($basePath !== '/') {
            $requestUri = str_replace($basePath, '', $requestUri);
        }
        
        $requestUri = rtrim($requestUri, '/') ?: '/';

        foreach ($this->routes as $route) {
            $pattern = $this->convertToRegex($route['path']);
            
            if ($route['method'] === $requestMethod && preg_match($pattern, $requestUri, $matches)) {
                array_shift($matches);
                
                $controllerName = $route['controller'];
                $actionName = $route['action'];
                
                if (class_exists($controllerName)) {
                    $controller = new $controllerName();
                    if (method_exists($controller, $actionName)) {
                        call_user_func_array([$controller, $actionName], $matches);
                        return;
                    }
                }
            }
        }

        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Route not found']);
    }

    private function convertToRegex($path) {
        $path = preg_replace('/\{(\w+)\}/', '([^/]+)', $path);
        return '#^' . $path . '$#';
    }
}
?>