<?php

/**
 * Minimal path router with method + parameter support.
 */
class Router
{
    /** @var array<int, array{method:string, path:string, controller:string, action:string}> */
    private array $routes = [];

    public function get(string $path, string $controller, string $action): void
    {
        $this->add('GET', $path, $controller, $action);
    }

    public function post(string $path, string $controller, string $action): void
    {
        $this->add('POST', $path, $controller, $action);
    }

    public function put(string $path, string $controller, string $action): void
    {
        $this->add('PUT', $path, $controller, $action);
    }

    public function patch(string $path, string $controller, string $action): void
    {
        $this->add('PATCH', $path, $controller, $action);
    }

    public function delete(string $path, string $controller, string $action): void
    {
        $this->add('DELETE', $path, $controller, $action);
    }

    private function add(string $method, string $path, string $controller, string $action): void
    {
        $this->routes[] = [
            'method'     => $method,
            'path'       => $path,
            'controller' => $controller,
            'action'     => $action,
        ];
    }

    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $this->currentUri();
        $allowed = [];

        foreach ($this->routes as $route) {
            if (!preg_match($this->toRegex($route['path']), $uri, $matches)) {
                continue;
            }

            if ($route['method'] !== $method) {
                $allowed[] = $route['method'];
                continue;
            }

            $controller = $route['controller'];
            $action = $route['action'];

            if (!class_exists($controller) || !method_exists($controller, $action)) {
                $this->respond([
                    'success' => false,
                    'message' => "Handler {$controller}::{$action} was not found.",
                ], 500);
            }

            array_shift($matches);
            (new $controller())->{$action}(...array_values($matches));
            return;
        }

        if ($allowed !== []) {
            header('Allow: ' . implode(', ', array_unique($allowed)));
            $this->respond(['success' => false, 'message' => 'Method not allowed.'], 405);
        }

        $this->respond(['success' => false, 'message' => 'Route not found.'], 404);
    }

    /** The request path with the install directory removed, so routes are portable. */
    private function currentUri(): string
    {
        $uri = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
        $scriptDir = str_replace('\\', '/', dirname(rawurldecode($_SERVER['SCRIPT_NAME'] ?? '')));

        if ($scriptDir !== '/' && $scriptDir !== '.' && str_starts_with($uri, $scriptDir)) {
            $uri = substr($uri, strlen($scriptDir));
        }

        $uri = '/' . ltrim($uri, '/');

        return $uri === '/' ? '/' : rtrim($uri, '/');
    }

    private function toRegex(string $path): string
    {
        $pattern = preg_replace('#\{[a-zA-Z_][a-zA-Z0-9_]*\}#', '([^/]+)', $path);

        return '#^' . $pattern . '$#';
    }

    private function respond(array $payload, int $status): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
