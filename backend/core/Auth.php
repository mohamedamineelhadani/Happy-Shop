<?php

/**
 * Stateless bearer-token authentication for the admin panel.
 * Tokens are HMAC signed and carry an expiry, so no session storage is needed.
 */
class Auth
{
    private const TTL = 60 * 60 * 12; // 12 hours

    public static function issue(array $payload): string
    {
        $payload['exp'] = time() + self::TTL;
        $body = self::encode((string) json_encode($payload));
        $signature = self::encode(hash_hmac('sha256', $body, SECRET_KEY, true));

        return $body . '.' . $signature;
    }

    public static function verify(?string $token): ?array
    {
        if (!$token || !str_contains($token, '.')) {
            return null;
        }

        [$body, $signature] = explode('.', $token, 2);
        $expected = self::encode(hash_hmac('sha256', $body, SECRET_KEY, true));

        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $payload = json_decode(self::decode($body), true);

        if (!is_array($payload) || ($payload['exp'] ?? 0) < time()) {
            return null;
        }

        return $payload;
    }

    public static function bearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';

        if ($header === '' && function_exists('getallheaders')) {
            foreach (getallheaders() as $name => $value) {
                if (strcasecmp($name, 'Authorization') === 0) {
                    $header = $value;
                    break;
                }
            }
        }

        if (preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    public static function user(): ?array
    {
        return self::verify(self::bearerToken());
    }

    /** Abort with 401 unless a valid token is present. Returns the token payload. */
    public static function require(): array
    {
        $user = self::user();

        if ($user === null) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'message' => 'Your session has expired. Please sign in again.',
            ]);
            exit;
        }

        return $user;
    }

    private static function encode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function decode(string $data): string
    {
        return (string) base64_decode(strtr($data, '-_', '+/'));
    }
}
