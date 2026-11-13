<?php

/**
 * Base controller: JSON responses, request parsing and validation.
 */
abstract class Controller
{
    /** Emit a JSON response and stop. */
    protected function json($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    protected function success($data = null, string $message = 'OK', int $status = 200): void
    {
        $this->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    protected function error(string $message, int $status = 400, $errors = null): void
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        $this->json($payload, $status);
    }

    /** Decoded request body (JSON, form or multipart). */
    protected function body(): array
    {
        static $cached = null;

        if ($cached !== null) {
            return $cached;
        }

        $raw = file_get_contents('php://input') ?: '';
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        if ($raw !== '' && stripos($contentType, 'application/json') !== false) {
            $decoded = json_decode($raw, true);
            return $cached = is_array($decoded) ? $decoded : [];
        }

        if ($_POST !== []) {
            return $cached = $_POST;
        }

        if ($raw !== '') {
            parse_str($raw, $parsed);
            return $cached = is_array($parsed) ? $parsed : [];
        }

        return $cached = [];
    }

    protected function input(string $key, $default = null)
    {
        return $this->body()[$key] ?? $default;
    }

    protected function query(string $key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }

    /**
     * Validate the request body against a rule set. On failure a 422 is sent
     * immediately and the script exits.
     *
     * @param array<string, string> $rules
     * @return array the validated body
     */
    protected function validate(array $rules): array
    {
        $data = $this->body();
        $errors = Validator::check($data, $rules);

        if ($errors !== []) {
            $this->error('Please check the highlighted fields.', 422, $errors);
        }

        return $data;
    }
}
