<?php

class AuthController extends Controller
{
    private Admin $admins;

    public function __construct()
    {
        $this->admins = new Admin();
    }

    /** POST /api/auth/login */
    public function login(): void
    {
        $data = $this->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = $this->admins->findByEmail(trim((string) $data['email']));

        if ($admin === null || !password_verify((string) $data['password'], $admin['password_hash'])) {
            $this->error('These credentials do not match our records.', 401);
        }

        $token = Auth::issue([
            'sub'   => (int) $admin['id'],
            'name'  => $admin['name'],
            'email' => $admin['email'],
            'role'  => $admin['role'],
        ]);

        $this->success([
            'token' => $token,
            'user'  => [
                'id'    => (int) $admin['id'],
                'name'  => $admin['name'],
                'email' => $admin['email'],
                'role'  => $admin['role'],
            ],
        ], 'Welcome back.');
    }

    /** GET /api/auth/me */
    public function me(): void
    {
        $payload = Auth::require();

        $admin = $this->admins->find((int) $payload['sub']);

        if ($admin === null) {
            $this->error('Admin not found.', 404);
        }

        $this->success($this->present($admin));
    }

    /** PUT /api/auth/profile — update the signed-in admin's details. */
    public function updateProfile(): void
    {
        $payload = Auth::require();
        $id = (int) $payload['sub'];

        $admin = $this->admins->find($id);

        if ($admin === null) {
            $this->error('Admin not found.', 404);
        }

        $data = $this->validate([
            'name'  => 'string|maxlen:150',
            'email' => 'email|maxlen:200',
        ]);

        $update = [];

        if (array_key_exists('name', $data) && trim((string) $data['name']) !== '') {
            $update['name'] = trim((string) $data['name']);
        }

        if (array_key_exists('email', $data) && trim((string) $data['email']) !== '') {
            $email = strtolower(trim((string) $data['email']));
            $existing = $this->admins->findByEmail($email);

            if ($existing !== null && (int) $existing['id'] !== $id) {
                $this->error('Please check the highlighted fields.', 422, [
                    'email' => 'That email is already in use.',
                ]);
            }

            $update['email'] = $email;
        }

        $newPassword = (string) ($data['password'] ?? '');

        if ($newPassword !== '') {
            $errors = [];

            if (mb_strlen($newPassword) < 8) {
                $errors['password'] = 'Password must be at least 8 characters.';
            }

            if (!password_verify((string) ($data['current_password'] ?? ''), $admin['password_hash'])) {
                $errors['current_password'] = 'Your current password is incorrect.';
            }

            if ((string) ($data['password_confirmation'] ?? '') !== $newPassword) {
                $errors['password_confirmation'] = 'The two passwords do not match.';
            }

            if ($errors !== []) {
                $this->error('Please check the highlighted fields.', 422, $errors);
            }

            $update['password_hash'] = password_hash($newPassword, PASSWORD_DEFAULT);
        }

        if ($update !== []) {
            $this->admins->update($id, $update);
        }

        $this->success($this->present($this->admins->find($id)), 'Profile updated.');
    }

    /** Shape an admin row for the API (never expose the password hash). */
    private function present(array $admin): array
    {
        return [
            'id'    => (int) $admin['id'],
            'name'  => $admin['name'],
            'email' => $admin['email'],
            'role'  => $admin['role'],
        ];
    }
}
